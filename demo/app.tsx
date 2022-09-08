import React, { FC, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import MultipleCorpSketch from '../src';
import { AnyType } from '../src/types';
import { identity } from 'lodash';

const App: FC = () => {
	const [coordinates, setCoordinates] = useState([]);
	const ref = useRef({ getCropData: identity });
	return (
		<>
			<MultipleCorpSketch
				coordinates={coordinates}
				width={544}
				// src="https://js-ec.static.yximgs.com/udata/pkg/ks-merchant/cps-hybrid/empty_position.9b16b85c5a152402.png"
				src="https://ali2.a.kwimgs.com/kos/nlav11092/fangzhou/pub/compress/image-55e7ab12-7fcf-46ec-9e4f-1702083cedb4.png"
				onChange={(_, _index, coordinates) => {
					setCoordinates(coordinates);
				}}
				ref={ref}
			/>
			<div style={{ margin: '20px' }}>
				<button onClick={() => console.log(ref.current.getCropData(coordinates))}>获取图片数据</button>
			</div>
		</>
	);
};

ReactDom.render(<App />, document.getElementById('root'));