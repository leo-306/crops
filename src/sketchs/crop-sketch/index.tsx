import React, { FC, MouseEventHandler, useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import { clamp, throttle } from 'lodash';
import { Coordinate, CorpSketchProps, Point } from '@/types';
import { generateID, getCursorPointer } from '@/utils';
import { BASE_COORDINATE_CONFIG } from '@/constants';
import HotArea from './components/hot-area';

import styles from './index.less';

const MultipleCorpSketch: FC<CorpSketchProps> = props => {
	const {
		coordinates,
		coordinateConfig = BASE_COORDINATE_CONFIG,
		onChange,
		sketchStyle,
		src,
		onAdd,
		onDelete,
		getCropData,
		onMount
	} = props;

	const startPoint = useRef<Point | null>(null);
	const currentIndex = useRef(0);
	const currentId = useRef('');
	const moved = useRef(false);
	const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const getCoordinatePosition = useCallback((event: MouseEvent) => {
		const rect = containerRef.current.getBoundingClientRect();
		let { x: pointX, y: pointY } = getCursorPointer(event);

		pointX = clamp(pointX, rect.left, rect.left + rect.width);
		pointY = clamp(pointY, rect.top, rect.top + rect.height);

		const curX = Math.min(startPoint.current.x, pointX) - rect.left;
		const curY = Math.min(startPoint.current.y, pointY) - rect.top;

		return {
			x: curX,
			y: curY,
			width: clamp(
				Math.abs(startPoint.current.x - pointX),
				coordinateConfig.minWidth ?? 0,
				coordinateConfig.maxWidth ?? rect.width ?? Number.MAX_VALUE
			),
			height: clamp(
				Math.abs(startPoint.current.y - pointY),
				coordinateConfig.minHeight ?? 0,
				coordinateConfig.maxHeight ?? rect.height ?? Number.MAX_VALUE
			),
			id: currentId.current ?? generateID(),
		};
	}, [coordinateConfig]);

	const resetCoordinate = useCallback(() => {
		startPoint.current = null;
		currentId.current = '';
		setCurrentCoordinate(null);
		moved.current = false;
	}, []);

	const onMouseDown: MouseEventHandler = useCallback(event => {
		startPoint.current = getCursorPointer(event);
		currentIndex.current = coordinates.length;
		currentId.current = generateID();
	}, [coordinates, getCoordinatePosition]);

	const onMouseMove: MouseEventHandler = useCallback(throttle(event => {
		if (startPoint.current) {
			moved.current = true;
			setCurrentCoordinate(getCoordinatePosition(event));
		}
	}, 100, { leading: true } ), [getCoordinatePosition]);

	const onMouseUp = useCallback(() => {
		if (moved.current) {
			onAdd?.(currentCoordinate, currentIndex.current);
			onChange?.(currentCoordinate, currentIndex.current, [...coordinates, currentCoordinate]);
		}

		resetCoordinate();
	}, [currentCoordinate, onAdd, onChange, coordinates]);

	const onMouseLeave = useCallback((event) => {
		if (moved.current) {
			const coordinate = getCoordinatePosition(event);

			setCurrentCoordinate(coordinate);
			onAdd?.(coordinate, currentIndex.current);
			onChange?.(coordinate, currentIndex.current, [...coordinates, coordinate]);

			resetCoordinate();
		}
	}, [onAdd, onChange, coordinates, getCoordinatePosition]);

	const hotAreaChange = useCallback((coordinate: Coordinate) => {
		const index = coordinates.findIndex(c => c.id === coordinate.id);

		if (index !== -1) {
			onChange?.(coordinate, index, [...coordinates.slice(0, index), coordinate, ...coordinates.slice(index + 1)]);
		}
	}, [coordinates, onChange]);

	const hotAreaDelete = useCallback((coordinate: Coordinate) => {
		const index = coordinates.findIndex(c => c.id === coordinate.id);

		if (index !== -1) {
			onDelete?.(coordinate, index);
			onChange?.(coordinate, index, [...coordinates.slice(0, index), ...coordinates.slice(index + 1)]);
		}
	}, [coordinates, onDelete, onChange]);

	/** mounted time */
	useEffect(() => {
		onMount?.();
	}, []);

	return (
		<div
			className={styles.cropContainer}
			style={sketchStyle}
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseLeave}
		>
			<img className={styles.img} src={src} alt="" draggable={false} />
			{[...coordinates, currentCoordinate].filter(Boolean).map((coordinate, index) => {
				return (
					<HotArea
						coordinate={coordinate}
						key={coordinate.id}
						index={index}
						onChange={hotAreaChange}
						onDelete={hotAreaDelete}
					/>
				);
			})}
		</div>
	);
};

export default MultipleCorpSketch;