import React, {
	forwardRef,
	ForwardRefRenderFunction,
	useCallback,
	useEffect,
	useImperativeHandle, useRef,
	useState
} from 'react';
import { isNumber } from 'lodash';
import { getImageObject } from '@/utils';
import { Coordinate, CorpCanvasSketchProps, CorpData, CorpSketchRef } from '@/types';
import { BASE_COORDINATE_CONFIG, INIT_IMG_RECT } from '@/constants';

const CropCanvasSketch: ForwardRefRenderFunction<CorpSketchRef, CorpCanvasSketchProps> = (props, ref) => {
	const {
		coordinates,
		coordinateConfig = BASE_COORDINATE_CONFIG,
		onChange,
		src,
		width,
		height,
		className = '',
		onAdd,
		onDelete,
		locationLine: showLocationLine = true,
		onMount
	} = props;
	const [originRect, setOriginRect] = useState(INIT_IMG_RECT);
	const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate | null>(null);
	const canvasNode = useRef<HTMLCanvasElement>(null);
	const originImage = useRef<HTMLImageElement>(null);

	const handleCanvasRef = useCallback(ref => {
		if (ref) {
			canvasNode.current = ref;
			/** 画布宽度跟随 像素比(dpr) 放大 */
			ref.width = originRect.width * window.devicePixelRatio;
			ref.height = originRect.height * window.devicePixelRatio;
			ref.style.width = originRect.width + 'px';
			ref.style.height = originRect.height + 'px';

			const ctx = ref.getContext('2d');
			ctx.clearRect(0, 0, originRect.width, originRect.height);
			/** 将每个单位放大像素比(dpr)大小，存储图片更多像素信息 */
			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

			ctx.drawImage(originImage.current, 0, 0, originRect.width, originRect.height);
		}
	}, [originRect]);
  
	useEffect(() => {
		getImageObject(src).then(image => {
			if (image) {
				originImage.current = image;
				const originWidth = isNumber(width) ? width : image.width;

				setOriginRect({
					width: originWidth,
					height: isNumber(height) ? height : (image.height / (image.width / originWidth)),
				});
			}
		});
	}, [src, width, height]);

	useImperativeHandle(ref, () => ({
		getCropData(coordinates: Coordinate[]): CorpData[] {
			console.log(coordinates);
			return [];
		},
	}), [src, width]);
  
	return originRect.width ? <canvas ref={handleCanvasRef} className={className} /> : null;
};

export default forwardRef<CorpSketchRef, CorpCanvasSketchProps>(CropCanvasSketch);