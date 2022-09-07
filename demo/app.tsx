import React, { FC, useState } from 'react';
import ReactDom from 'react-dom';
import MultipleCorpSketch from '../src';

const App: FC = () => {
	const [coordinates, setCoordinates] = useState([]);
	return (
		<>
			<MultipleCorpSketch
				coordinates={coordinates}
				sketchStyle={{ width: 544, height: 544 }}
				src="https://js-ec.static.yximgs.com/udata/pkg/ks-merchant/cps-hybrid/empty_position.9b16b85c5a152402.png"
				onChange={(_, _index, coordinates) => {
					setCoordinates(coordinates);
				}}
			/>
			<div style={{ height: '100vw' }}></div>
		</>
	);
};

ReactDom.render(<App />, document.getElementById('root'));