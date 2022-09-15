import React, {
	forwardRef,
	ForwardRefRenderFunction,
	MouseEvent,
	MouseEventHandler,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from 'react';
import { clamp, isNumber, throttle } from 'lodash';
import { Coordinate, CorpData, CorpSketchProps, CorpSketchRef, LocationLineInfo, Point } from '@/types';
import { createCanvas, generateID, getCursorPointer } from '@/utils';
import { BASE_COORDINATE_CONFIG } from '@/constants';
import HotArea from './components/hot-area';
import LocationLine from './components/location-line';

import styles from './index.less';

const MultipleCorpSketch: ForwardRefRenderFunction<CorpSketchRef, CorpSketchProps> = (props, ref) => {
	const {
		coordinates,
		coordinateConfig = BASE_COORDINATE_CONFIG,
		onChange,
		src,
		width,
		limit = Number.MAX_VALUE,
		height = 'auto',
		className = '',
		onAdd,
		onDelete,
		locationLine: showLocationLine = true,
		onMount
	} = props;

	const [locationLineInfo, setLocationLineInfo] = useState<LocationLineInfo | null>(null);
	const startPoint = useRef<Point | null>(null);
	const currentIndex = useRef(0);
	const currentId = useRef('');
	const moved = useRef(false);
	const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const sketchStyle = useMemo(() => ({ width, height }), [width, height]);

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
		setLocationLineInfo(null);
	}, []);

	const onMouseDown: MouseEventHandler = useCallback(event => {
		if (coordinates.length >= limit) {
			return;
		}
		startPoint.current = getCursorPointer(event);
		currentIndex.current = coordinates.length;
		currentId.current = generateID();
	}, [coordinates, getCoordinatePosition, limit]);

	const onMouseMove: MouseEventHandler = useCallback(throttle(event => {
		if (startPoint.current) {
			moved.current = true;
			const coordinate = getCoordinatePosition(event);
			const rect = containerRef.current.getBoundingClientRect();

			setCurrentCoordinate(coordinate);

			showLocationLine && setLocationLineInfo({
				offset: {
					leftTopHorizontal: coordinate.x,
					leftTopVertical: coordinate.y,
					rightBottomHorizontal: rect.width - coordinate.width - coordinate.x,
					rightBottomVertical: rect.height - coordinate.height - coordinate.y,
				},
				style: {
					leftTopHorizontal: {
						left: 0,
						top: coordinate.y + 'px',
						width: coordinate.x + 'px',
					},
					leftTopVertical: {
						left: coordinate.x + 'px',
						top: 0,
						height: coordinate.y + 'px',
					},
					rightBottomHorizontal: {
						left: (coordinate.x + coordinate.width) + 'px',
						top: (coordinate.y + coordinate.height) + 'px',
						width: (rect.width - coordinate.width - coordinate.x) + 'px',
					},
					rightBottomVertical: {
						left: (coordinate.x + coordinate.width) + 'px',
						top: (coordinate.y + coordinate.height) + 'px',
						height: (rect.height - coordinate.height - coordinate.y) + 'px',
					},
				},
			});
		}
	}, 100, { leading: true } ), [showLocationLine, getCoordinatePosition]);

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

	/** 热区变更 */
	const hotAreaChange = useCallback((coordinate: Coordinate) => {
		const index = coordinates.findIndex(c => c.id === coordinate.id);

		if (index !== -1) {
			onChange?.(coordinate, index, [...coordinates.slice(0, index), coordinate, ...coordinates.slice(index + 1)]);
		}
	}, [coordinates, onChange]);

	/** 删除热区 */
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

	useImperativeHandle(ref, () => ({
		getCropData(coordinates: Coordinate[]): CorpData[] {
			if (!src) {
				return coordinates as CorpData[];
			}

			const rect = containerRef.current.getBoundingClientRect();
			const originWidth = isNumber(width) ? width : rect.width;
			const originHeight = isNumber(height) ? height : rect.height;
			const [, ctx] = createCanvas({ width: isNumber(width) ? width : rect.width, height: isNumber(height) ? height : rect.height });
			ctx.drawImage(imageRef.current, 0, 0, originWidth, originHeight);

			return coordinates.map(coordinate => {
				const [imgCanvas, imgCtx] = createCanvas({ width: coordinate.width, height: coordinate.height });
				imgCtx.putImageData(
					ctx.getImageData(
						coordinate.x * window.devicePixelRatio,
						coordinate.y * window.devicePixelRatio,
						coordinate.width * window.devicePixelRatio,
						coordinate.height * window.devicePixelRatio
					),
					0,
					0
				);

				return { ...coordinate, img: imgCanvas.toDataURL() };
			});
		},
	}), [src, width, height]);

	return (
		<div
			className={`${styles.cropContainer} ${className}`}
			style={sketchStyle}
			ref={containerRef}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseLeave}
		>
			<img ref={imageRef} className={styles.img} src={src} alt="" draggable={false} crossOrigin="anonymous" />
			{(showLocationLine && locationLineInfo) ? <LocationLine info={locationLineInfo} /> : null}
			{[...coordinates, currentCoordinate].filter(Boolean).map((coordinate, index) => {
				return (
					<HotArea
						coordinate={coordinate}
						key={coordinate.id}
						index={index}
						showLocationLine={showLocationLine}
						onChange={hotAreaChange}
						onDelete={hotAreaDelete}
						setLocationInfo={setLocationLineInfo}
					/>
				);
			})}
		</div>
	);
};

export default forwardRef<CorpSketchRef, CorpSketchProps>(MultipleCorpSketch);