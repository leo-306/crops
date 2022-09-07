import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
	'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	5
);

/** 生成唯一 ID */
export const generateID = () => {
	return `u_${nanoid()}`;
};