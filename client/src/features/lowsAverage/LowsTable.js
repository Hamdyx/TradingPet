import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLows, selectAllLows, selectLowsIds, selectLowById } from './lowsSlice';
import IntervalRow from '../IntervalRow';
import AverageRow from '../AverageRow';

const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const LowsTable = () => {
	const dispatch = useDispatch();
	const lowsIds = useSelector(selectLowsIds);
	const allLows = useSelector(selectAllLows);
	const lowsStatus = useSelector((state) => state.lows.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchLows());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectLowById} />
	));

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>Lows</th>
					<th>20</th>
					<th>50</th>
					<th>100</th>
					<th>200</th>
					<th>AVG</th>
				</tr>
			</thead>
			<tbody>
				{content}
				{/* <AverageRow selector={selectAllLows} /> */}
			</tbody>
		</Table>
	);
};

export default LowsTable;
