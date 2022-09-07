import { useCallback, useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import { AnyType } from '@/types';

export type ChangeValue = {
	x: number;
	y: number;
	width: number;
	height: number;
};
export type DragDomProps = {
	parentNode?: HTMLElement;
	moveStart?(event: AnyType): void;
	moveEnd?(event: AnyType): void;
	resizeStart?(event: AnyType): void;
	resizeEnd?(event: AnyType): void;
  onChange?(value: ChangeValue): void;
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
	const position = useRef({ x: 0, y: 0 });
  
	const drag = useCallback((ref) => ref && setNode(ref), []);

	useEffect(() => {
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
						let { x, y } = event.target.dataset;
						position.current = {
							x: parseFloat(x) || 0,
							y: parseFloat(y) || 0,
						};

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
				margin: 8,
				edges: { top: true, left: true, bottom: true, right: true },
				listeners: {
					start(event) {
						let { x, y } = event.target.dataset;
						position.current = {
							x: parseFloat(x) || 0,
							y: parseFloat(y) || 0,
						};

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

		return () => {
			interact(node).unset();
		};
	}, [node, ...deps]);

	return [{ isDragging }, drag];
};