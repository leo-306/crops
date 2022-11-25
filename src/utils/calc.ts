import { Point } from '@/types';

/** 计算角度 */
export const calcRadians = (point: Point, origin: Point): number => {
	return Math.atan2(point.x - origin.x, point.y - origin.y);
};

/** 数学角度(弧度)转换为浏览器识别的角度 */
export const convertRadiansToDegrees = (radians: number) => {
	/** 代表向左上滑动 radians 为负数，* -1 得到最终的偏移值 */
	return (radians * (180 / Math.PI) * -1) + 180;
};

export const calcDegrees= (point: Point, origin: Point): number => {
	return convertRadiansToDegrees(calcRadians(point, origin));
};