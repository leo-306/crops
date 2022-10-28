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

export const useDragDom = (props: DragDomProps, deps: AnyType[] = []): DragDomReturnType => {
	const [isDragging, setIsDragging] = useState(false);
	const [node, setNode] = useState<HTMLDivElement>(null);
	/** 坐标值，旋转时表示初始坐标值，在缩放拖拽时会随动作更改 */
	const position = useRef({ x: 0, y: 0 });
	/** 原点坐标，旋转时使用到 */
	const originPoint = useRef({ x: 0, y: 0 });

	const drag = useCallback((ref) => ref && setNode(ref), []);

	useEffect(() => {
		let rotateTarget = null;
		if (!node) {
			return;
		}

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
								const rect = node.getBoundingClientRect();
								/** 原点 */
								originPoint.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

								props.rotateStart?.(event);
							},
							move(event) {
								setIsDragging(true);
								const degrees = Math.round(calcDegrees(event.page, originPoint.current));

								props.onRotateChange?.(degrees);
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