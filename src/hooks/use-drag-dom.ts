import { useCallback, useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import { AnyType } from '@/types';
import { calcDegrees } from '@/utils';

export type ChangeValue = {
	x: number;
	y: number;
	width: number;
	height: number;
};
export type DragDomProps = {
	parentNode?: HTMLElement;
	rotatable: boolean;
	selected: boolean;
	moveStart?(event: AnyType): void;
	moveEnd?(event: AnyType): void;
	resizeStart?(event: AnyType): void;
	resizeEnd?(event: AnyType): void;
	rotateStart?(event: AnyType): void;
	rotateEnd?(event: AnyType): void;
  onChange?(value: ChangeValue): void;
	onRotateChange?(degrees: number): void;
};
export type DragDomReturnType = [{ isDragging: boolean }, (ref: HTMLElement) => void];

const getNumberFormStyle = (style: number | string = '') => {
	try {
		const number = parseFloat(String(style).replace('px', ''));

		return Number.isNaN(number) ? 0 : number;
	} catch {
		return 0;
	}
};
export const useDragDom = (props: DragDomProps, deps: AnyType[] = []): DragDomReturnType => {
	const [isDragging, setIsDragging] = useState(false);
	const [node, setNode] = useState<HTMLDivElement>(null);
	/** 坐标值，旋转时表示初始坐标值，在缩放拖拽时会随动作更改 */
	const position = useRef({ x: 0, y: 0 });
	/** 原点坐标，旋转时使用到 */
	const originPoint = useRef({ x: 0, y: 0 });
	/** 记录上一次的旋转值 */
	const preRotate = useRef(0);
  
	const drag = useCallback((ref) => ref && setNode(ref), []);

	useEffect(() => {
		let rotateTarget = null;
		if (!node) {
			return;
		}

		Object.assign(node.dataset, { x: getNumberFormStyle(node.style?.left), y: getNumberFormStyle(node.style?.top) });
		interact(node)
			.draggable({
				origin: props.parentNode,
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: props.parentNode,
						endOnly: true
					})
				],
				listeners: {
					start(event) {
						const { x, y } = event.target.dataset;
						position.current = { x: parseFloat(x) || 0, y: parseFloat(y) || 0 };

						props.moveStart?.(event);
					},
					move(event) {
						setIsDragging(true);
						position.current.x += event.dx;
						position.current.y += event.dy;

						props.onChange?.({ ...position.current, width: event.rect.width, height: event.rect.height });
					},
					end(event) {
						props.moveEnd?.(event);
					}
				}
			})
			.resizable({
				invert: 'reposition',
				ignoreFrom: '.rotatable-handle',
				margin: 8,
				edges: { top: true, left: true, bottom: true, right: true },
				origin: props.parentNode,
				modifiers: [
					interact.modifiers.restrictSize({ max: 'parent', endOnly: true })
				],
				enabled: props.selected,
				listeners: {
					start(event) {
						const { x, y } = event.target.dataset;
						position.current = { x: parseFloat(x) || 0, y: parseFloat(y) || 0 };

						props.resizeStart?.(event);
					},
					move(event) {
						position.current.x += event.deltaRect.left;
						position.current.y += event.deltaRect.top;

						props.onChange?.({ ...position.current, width: event.rect.width, height: event.rect.height });
					},
					end(event) {
						props.resizeEnd?.(event);
					}
				}
			})
			.on('mousedown', event => event.stopPropagation());
		
		if (props.rotatable) {
			rotateTarget = node.querySelector('.rotatable-handle') as HTMLElement;

			if (rotateTarget) {
				interact(rotateTarget)
					.draggable({
						allowFrom: '.rotatable-handle',
						origin: props.parentNode,
						modifiers: [
							interact.modifiers.restrictRect({
								restriction: props.parentNode,
								endOnly: true
							})
						],
						enabled: props.selected,
						listeners: {
							start(event) {
								const { x, y } = event.page;
								preRotate.current = parseFloat(node.dataset.rotate ?? '0');
								/** 起始点 */
								position.current = { x, y };
								/** 原点 */
								originPoint.current = { x: x - 100, y };

								props.rotateStart?.(event);
							},
							move(event) {
								setIsDragging(true);
								let degrees = Math.round(calcDegrees(position.current, event.page, originPoint.current));

								if (event.page.y < position.current.y) {
									degrees = -degrees;
								}

								props.onRotateChange?.(preRotate.current + degrees);
							},
							end(event) {
								props.rotateEnd?.(event);
							}
						}
					});
			}
		}

		return () => {
			node && interact(node).unset();
			rotateTarget && interact(rotateTarget).unset();
		};
	}, [node, ...deps]);

	return [{ isDragging }, drag];
};