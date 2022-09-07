import { AnyType } from '@/types';
import { MouseEvent } from 'react';

/** 查找绝对定位元素的相对父元素 */
export const getAbsoluteParent = (target: HTMLElement) => {
	let currentTarget = target.parentElement;
	let parentNode: HTMLElement = null;
	while (currentTarget !== null && currentTarget.tagName !== 'HTML') {
		if (['relative', 'absolute', 'fixed', 'sticky'].includes((currentTarget as AnyType)?.computedStyleMap?.().get('position').value)) {
			parentNode = currentTarget;
			break;
		}

		currentTarget = currentTarget.parentElement;
	}

	return parentNode;
};

/** 返回鼠标坐标 */
export const getCursorPointer = (event: MouseEvent) => {
	return { x: event.clientX, y: event.clientY };
};