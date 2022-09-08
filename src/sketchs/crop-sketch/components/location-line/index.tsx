import React, { FC } from 'react';
import { LocationLineInfo } from '@/types';

import styles from './index.less';

type LocationLineProps = { info: LocationLineInfo };
const LocationLine: FC<LocationLineProps> = props => {
	const { info } = props;

	return (
		<>
			<div
				className={styles.leftTopVerticalLine}
				style={info.style?.leftTopVertical}
				data-origin-offset={info.offset?.leftTopVertical}
				data-offset={Math.round(info.offset?.leftTopVertical)}
			/>
			<div
				className={styles.leftTopHorizontalLine}
				style={info.style?.leftTopHorizontal}
				data-origin-offset={info.offset?.leftTopHorizontal}
				data-offset={Math.round(info.offset?.leftTopHorizontal)}
			/>
			<div
				className={styles.rightBottomVerticalLine}
				style={info.style?.rightBottomVertical}
				data-origin-offset={info.offset?.rightBottomVertical}
				data-offset={Math.round(info.offset?.rightBottomVertical)}
			/>
			<div
				className={styles.rightBottomHorizontalLine}
				style={info.style?.rightBottomHorizontal}
				data-origin-offset={info.offset?.rightBottomHorizontal}
				data-offset={Math.round(info.offset?.rightBottomHorizontal)}
			/>
		</>
	);
};

export default LocationLine;