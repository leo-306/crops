import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
	'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	5
);

/** ηζε―δΈ ID */
export const generateID = () => {
	return `u_${nanoid()}`;
};