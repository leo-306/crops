import { useCallback, useEffect, useRef } from 'react';
import { AnyType } from '@/types';

type StaticCallbackFn = (...args: AnyType) => AnyType;
export const useStaticCallback = (callback: StaticCallbackFn) => {
	const callbackRef = useRef<StaticCallbackFn>(callback);

	const func: StaticCallbackFn = useCallback((...args) => {
		return callbackRef.current?.(...args);
	}, []);
  
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	return func;
};