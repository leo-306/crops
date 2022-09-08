import React, { FC, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import MultipleCorpSketch from '../src';
import { identity } from 'lodash';

const App: FC = () => {
	const [coordinates, setCoordinates] = useState([
		{
			x: 161,
			y: 589,
			width: 231,
			height: 113,
			id: 'u_vFRE6',
		}
	]);
	const ref = useRef({ getCropData: identity });

	const getCorpData = () => {
		const cropData = ref.current.getCropData(coordinates);
		setCoordinates(cropData);
		console.log('图片数据: ', cropData);
	};
	return (
		<>
			<MultipleCorpSketch
				coordinates={coordinates}
				width={544}
				src="https://img.zcool.cn/community/016dbe57b021070000012e7eedcf18.jpg@2o.jpg"
				onChange={(_, _index, coordinates) => {
					setCoordinates(coordinates);
				}}
				ref={ref}
			/>
			<div style={{ margin: '20px' }}>
				<button onClick={getCorpData}>获取图片数据</button>
			</div>
			<div>
				{coordinates.map((coordinate, index) => {
					return coordinate.img ? (
						<div key={coordinate.id}>
							<h5>热区{index + 1} ID: {coordinate.id}</h5>
							<img style={{ width: coordinate.width, height: coordinate.height }} src={coordinate.img} alt=""/>
						</div>
					) : null;
				})}
			</div>
		</>
	);
};

ReactDom.render(<App />, document.getElementById('root'));