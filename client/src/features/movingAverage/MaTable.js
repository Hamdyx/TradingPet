import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMA, selectAllMA, selectMaIds, selectMaById } from './maSlice';
import IntervalRow from '../IntervalRow';
const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const MaTable = () => {
	const dispatch = useDispatch();
	const maIds = useSelector(selectMaIds);
	const allMa = useSelector(selectAllMA);
	const maStatus = useSelector((state) => state.ma.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchMA());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectMaById} />
	));

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>MA</th>
					<th>20</th>
					<th>50</th>
					<th>100</th>
					<th>200</th>
					<th>AVG</th>
				</tr>
			</thead>
			<tbody>
				{content}
				<AverageRow />
			</tbody>
		</Table>
	);
};

const AverageRow = () => {
	const allMa = useSelector(selectAllMA);

	let sumMA = {
		20: 0,
		50: 0,
		100: 0,
		200: 0,
	};

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (allMa.length !== 0) {
		for (let i = 0; i < allMa.length; i++) {
			for (const [p, v] of Object.entries(allMa[i])) {
				sumMA[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumMA[20] / 8).toFixed(2)}</td>
				<td>{(sumMA[50] / 8).toFixed(2)}</td>
				<td>{(sumMA[100] / 8).toFixed(2)}</td>
				<td>{(sumMA[200] / 8).toFixed(2)}</td>
				<td>
					{(
						(sumMA[20] / 8 + sumMA[50] / 8 + sumMA[100] / 8 + sumMA[200] / 8) /
						4
					).toFixed(2)}
				</td>
			</>
		);
	}
	return <tr>{content}</tr>;
};

export default MaTable;
