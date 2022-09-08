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

/** 创建一个适配像素比的 canvas */
export const createCanvas = (options: { width: number; height: number }): [HTMLCanvasElement, CanvasRenderingContext2D] => {
	const { width, height } = options;
	const canvas = document.createElement('canvas');
	/** 画布宽度跟随 像素比(dpr) 放大 */
	canvas.width = width * window.devicePixelRatio;
	canvas.height = height * window.devicePixelRatio;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';

	const ctx = canvas.getContext('2d');
	/** 将每个单位放大像素比(dpr)大小，存储图片更多像素信息 */
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

	return [canvas, ctx];
};