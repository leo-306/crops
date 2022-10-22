import { Point } from '@/types';

/** 根据三点计算角度 */
export const calcAngel = (p0: Point, p1: Point, origin: Point): number => {
	const lengthP0Origin = Math.sqrt(Math.pow(origin.x - p0.x, 2) + Math.pow(origin.y - p0.y, 2));
	const lengthP1Origin = Math.sqrt(Math.pow(origin.x - p1.x, 2) + Math.pow(origin.y - p1.y, 2));
	const lengthP0P1 = Math.sqrt(Math.pow(p1.x - p0.x,2) + Math.pow(p1.y - p0.y,2));
	return Math.acos(
		(lengthP1Origin * lengthP1Origin + lengthP0Origin * lengthP0Origin - lengthP0P1 * lengthP0P1) /
		(2 * lengthP1Origin * lengthP0Origin)
	);
};

/** 数学角度转换为浏览器识别的角度 */
export const convertAngelToDegrees = (angle: number) => {
	return 360 * angle / (2 * Math.PI);
};

export const calcDegrees= (p0: Point, p1: Point, origin: Point): number => {
	return convertAngelToDegrees(calcAngel(p0, p1, origin));
};