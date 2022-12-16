import React, { FC, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import { identity } from 'lodash';
import MultipleCorpSketch from '../src';
import { Coordinate, CorpData } from '../src/types';

const App: FC = () => {
	const [coordinates, setCoordinates] = useState<Coordinate[]>([
		{
			x: 60,
			y: 200,
			width: 210,
			height: 113,
			rotate: 30,
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
		<div style={{ width: '100%', display: 'flex' }}>
			<div style={{ flex: 1 }}>
				<MultipleCorpSketch
					coordinates={coordinates}
					width={300}
					limit={2}
					rotatable
					src="http://pic.616pic.com/bg_w1180/00/24/12/2RxmGbjECV.jpg"
					onChange={(_, _index, coordinates) => {
						setCoordinates(coordinates);
					}}
					ref={ref}
				/>
				<div style={{ margin: '20px' }}>
					<button onClick={getCorpData}>获取图片数据</button>
				</div>
				<div>
					{coordinates.map((coordinate: CorpData, index) => {
						return coordinate.img ? (
							<div key={coordinate.id}>
								<h5>热区{index + 1} ID: {coordinate.id}</h5>
								<img style={{ width: coordinate.width, height: coordinate.height }} src={coordinate.img} alt=""/>
							</div>
						) : null;
					})}
				</div>
			</div>
		</div>
	);
};

ReactDom.render(<App />, document.getElementById('root'));