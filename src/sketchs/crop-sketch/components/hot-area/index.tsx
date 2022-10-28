import React, { FC, useCallback, useMemo } from 'react';
import { HotAreaProps } from '@/types';
import { useDragWithAbsolute } from '@/hooks';

import styles from './index.less';

const HotArea: FC<HotAreaProps> = props => {
	const {
		coordinate,
		index,
		onChange,
		onDelete,
		setLocationInfo,
		showLocationLine,
		selected,
		setSelectedId,
		rotatable
	} = props;
	const [dragWithAbsolute] = useDragWithAbsolute({
		showLocationLine,
		rotatable,
		selected,
		onChange: position => {
			setSelectedId(coordinate.id);
			onChange({ ...coordinate, ...position });
		},
		setLocationInfo,
	});

	const style = useMemo(() => {
		return {
			left: coordinate.x + 'px',
			top: coordinate.y + 'px',
			width: coordinate.width + 'px',
			height: coordinate.height + 'px',
			transform: `rotateZ(${coordinate.rotate}deg)`,
		};
	}, [coordinate]);

	const dataSet = useMemo(() => {
		return {
			'data-x': coordinate.x ?? 0,
			'data-y': coordinate.y ?? 0,
			'data-rotate': coordinate.rotate ?? 0,
		};
	}, [coordinate]);

	const onClick = useCallback((event) => {
		event.stopPropagation();
		setSelectedId(coordinate.id);
	}, []);
	return (
		<div
			{...dataSet}
			className={`${styles.areaContainer} ${selected ? styles.selected : ''}`}
			ref={dragWithAbsolute}
			style={style}
			onClick={onClick}
		>
			<div className={styles.cursor}>{index + 1}</div>
			<div className={styles.delete} onClick={() => onDelete(coordinate)}>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.25 8.3125C5.25 8.55412 5.44588 8.75 5.6875 8.75C5.92912 8.75 6.125 8.55412 6.125 8.3125V6.125C6.125 5.88338 5.92912 5.6875 5.6875 5.6875C5.44588 5.6875 5.25 5.88338 5.25 6.125V8.3125Z" fill="white"/>
					<path d="M7.875 8.3125C7.875 8.55412 8.07088 8.75 8.3125 8.75C8.55412 8.75 8.75 8.55412 8.75 8.3125V6.125C8.75 5.88338 8.55412 5.6875 8.3125 5.6875C8.07088 5.6875 7.875 5.88338 7.875 6.125V8.3125Z" fill="white"/>
					<path d="M5.4457 1.35868L4.81251 2.625H1.75C1.50838 2.625 1.3125 2.82088 1.3125 3.0625C1.3125 3.30412 1.50838 3.5 1.75 3.5H2.44801L2.78608 10.5834C2.83061 11.5164 3.60003 12.25 4.53409 12.25H9.46591C10.4 12.25 11.1694 11.5164 11.2139 10.5834L11.552 3.5H12.25C12.4916 3.5 12.6875 3.30412 12.6875 3.0625C12.6875 2.82088 12.4916 2.625 12.25 2.625H9.18751L8.55438 1.3587C8.40617 1.06226 8.10318 0.875 7.77176 0.875H6.22832C5.89689 0.875 5.59392 1.06225 5.4457 1.35868ZM7.77176 1.75L6.22832 1.75L5.7908 2.625H8.20924L7.77176 1.75ZM10.676 3.5L10.3399 10.5417C10.3176 11.0082 9.93294 11.375 9.46591 11.375H4.53409C4.06706 11.375 3.68235 11.0082 3.66009 10.5417L3.32401 3.5H10.676Z" fill="white"/>
				</svg>
			</div>

			{rotatable && selected ? (
				<div className={`${styles.rotatable} rotatable-handle`}>
					<svg className={'rotatable-handle'} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
						<path
							d="M853.333333 512c0-185.045333-156.288-341.333333-341.333333-341.333333v85.333333c138.752 0 256 117.248 256 256s-117.248 256-256 256v42.666667l-0.085333-42.666667h-0.469334a244.906667 244.906667 0 0 1-52.565333-5.717333l-18.346667 83.328c23.296 5.12 47.189333 7.722667 70.912 7.722666h0.64C697.088 853.290667 853.333333 697.002667 853.333333 512z"
							fill="white"></path>
						<path
							d="M510.933333 85.333333L341.333333 213.333333l169.6 128zM170.666667 512c0 41.045333 7.466667 81.322667 22.144 119.808l79.744-30.421333a248.96 248.96 0 0 1-15.914667-107.349334l-85.077333-6.101333A322.218667 322.218667 0 0 0 170.666667 512z m161.194666-180.352L271.530667 271.232a348.074667 348.074667 0 0 0-78.933334 121.6l79.744 30.336a262.826667 262.826667 0 0 1 59.52-91.52z m17.749334 479.744l41.088-74.752a265.130667 265.130667 0 0 1-82.645334-71.509333l-68.010666 51.584a350.933333 350.933333 0 0 0 109.568 94.677333z"
							fill="white"></path>
					</svg>
				</div>
			) : null}
			{selected ? (
				<>
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.leftTopArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.topCenterArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.rightTopArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.rightCenterArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.rightBottomArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.bottomCenterArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.leftBottomArea}`} />
					<div data-resize-area={1} className={`${styles.resizeArea} ${styles.leftCenterArea}`} />
				</>
			) : null}
		</div>
	);
};

export default HotArea;