import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';

import MaTable from '../movingAverage/MaTable';
import WmaTable from '../weightedMovingAverage/WmaTable';
import BbTable from '../bollingerBands/BbTable';
import HighsTable from '../highsAverage/HighsTable';
import LowsTable from '../lowsAverage/LowsTable';
// import WeightedMaTable from './WeightedMaTable';
// import BollingerBands from './BollingerBands';

import './CalculatorMA.css';

const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const CalculatorMA = () => {
	const initApi = async () => {
		const candleOHLC = await axios.get(`${myApi}`);
		/* console.log('candleOHLC');
		console.log(candleOHLC.data.data.candleOHLC); */
	};
	initApi();

	return (
		<Container className="CalculatorMA">
			<MaTable />
			<WmaTable />
			<BbTable />
			<HighsTable />
			<LowsTable />
		</Container>
	);
};

export default CalculatorMA;
