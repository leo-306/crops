import { useCallback, useMemo, useRef } from 'react';
import { clamp, throttle } from 'lodash';
import { useDragDom } from '@/hooks/use-drag-dom';
import { INIT_RECT } from '@/constants';
import { getAbsoluteParent } from '@/utils/dom';
import { Coordinate } from '@/types';
import { useStaticCallback } from '@/hooks/use-static-callback';

type Props = { onChange(position: Omit<Coordinate, 'id'>): void };
export const useDragWithAbsolute = (props: Props) => {
	const nodeRef = useRef<HTMLElement>(null);
	const parentRef = useRef<HTMLElement>(null);
	const parentRect = useRef(INIT_RECT);
	const isEnd = useRef(false);
	/** 缓存 onChange 方法 */
	const onChange = useStaticCallback(props.onChange);

	const onStart = useCallback(() => {
		parentRect.current = parentRef.current.getBoundingClientRect();
		isEnd.current = false;
		nodeRef.current.style.willChange = 'left, top, width, height';
	}, []);
	const onEnd = useCallback(() => {
		isEnd.current = true;

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
				}
			}, 40, { trailing: true }),
			resizeStart: onStart,
			resizeEnd: onEnd,
		};
	}, []);

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