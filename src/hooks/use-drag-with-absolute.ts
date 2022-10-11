import { useCallback, useMemo, useRef } from 'react';
import { clamp, throttle } from 'lodash';
import { useDragDom } from '@/hooks/use-drag-dom';
import { INIT_RECT } from '@/constants';
import { getAbsoluteParent } from '@/utils/dom';
import { Coordinate, LocationLineInfo } from '@/types';
import { useStaticCallback } from '@/hooks/use-static-callback';

type Props = {
	/** 是否显示辅助线 */
	showLocationLine: boolean;
	/** 是否允许旋转 */
	rotatable: boolean;
	/** 是否被选中 */
	selected: boolean;
	onChange(position: Omit<Coordinate, 'id'>): void;
	setLocationInfo(info: LocationLineInfo): void;
};
export const useDragWithAbsolute = (props: Props) => {
	const nodeRef = useRef<HTMLElement>(null);
	const parentRef = useRef<HTMLElement>(null);
	const parentRect = useRef(INIT_RECT);
	const isEnd = useRef(false);
	/** 缓存 onChange、setLocationLineInfo 方法 */
	const onChange = useStaticCallback(props.onChange);
	const setLocationLineInfo = useStaticCallback(props.setLocationInfo);

	const onStart = useCallback(() => {
		parentRect.current = parentRef.current.getBoundingClientRect();
		isEnd.current = false;
		nodeRef.current.style.willChange = 'left, top, width, height';
	}, []);
	const onEnd = useCallback(() => {
		isEnd.current = true;
		setLocationLineInfo(null);

		const { x, y, width, height } = nodeRef.current.dataset;
		onChange({
			x: parseFloat(x),
			y: parseFloat(y),
			width: parseFloat(width),
			height: parseFloat(height),
		});
	}, []);

	const dragParams = useMemo(() => {
		return {
			parentNode: parentRef.current,
			rotatable: props.rotatable,
			selected: props.selected,
			moveStart: onStart,
			moveEnd: onEnd,
			onChange: throttle(value => {
				value.x = clamp(value.x, 0, parentRect.current.width - value.width);
				value.y = clamp(value.y, 0, parentRect.current.height - value.height);

				nodeRef.current.style.left = value.x + 'px';
				nodeRef.current.style.top = value.y + 'px';
				nodeRef.current.style.width = value.width + 'px';
				nodeRef.current.style.height = value.height + 'px';
				Object.assign(nodeRef.current.dataset, value);

				/** 节流会造成极端情况，onChange 在 end 事件之后执行，此时需要执行 end 事件 */
				if (isEnd.current) {
					onEnd();
				} else if (props.showLocationLine) {
					setLocationLineInfo({
						offset: {
							leftTopHorizontal: value.x,
							leftTopVertical: value.y,
							rightBottomHorizontal: parentRect.current.width - value.width - value.x,
							rightBottomVertical: parentRect.current.height - value.height - value.y,
						},
						style: {
							leftTopHorizontal: {
								left: 0,
								top: value.y + 'px',
								width: value.x + 'px',
							},
							leftTopVertical: {
								left: value.x + 'px',
								top: 0,
								height: value.y + 'px',
							},
							rightBottomHorizontal: {
								left: (value.x + value.width) + 'px',
								top: (value.y + value.height) + 'px',
								width: (parentRect.current.width - value.width - value.x) + 'px',
							},
							rightBottomVertical: {
								left: (value.x + value.width) + 'px',
								top: (value.y + value.height) + 'px',
								height: (parentRect.current.height - value.height - value.y) + 'px',
							},
						},
					});
				}
			}, 40, { trailing: true }),
			resizeStart: onStart,
			resizeEnd: onEnd,
		};
	}, [props.showLocationLine, props.rotatable, props.selected]);

	const [, drag] = useDragDom(dragParams, [dragParams]);

	const dragWithAbsolute = useCallback(ref => {
		if (ref) {
			drag(ref);
			nodeRef.current = ref;
			parentRef.current = getAbsoluteParent(ref);
		}
	}, []);

	return [dragWithAbsolute];
};