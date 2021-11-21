import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLows, selectAllLows, selectLowsIds, selectLowById } from './lowsSlice';

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

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w'];
	const content = intervals.map((el) => <IntervalRow key={el} interval={el} />);

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
				<AverageRow />
			</tbody>
		</Table>
	);
};

const IntervalRow = ({ interval }) => {
	const dispatch = useDispatch();
	const high = useSelector((state) => selectLowById(state, interval));

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (high) {
		let data = high.data;
		if (
			data[20] !== null ||
			data[50] !== null ||
			data[100] !== null ||
			data[200] !== null
		) {
			content = (
				<>
					<td>{interval}</td>
					<td>{data[20].toFixed(2)}</td>
					<td>{data[50].toFixed(2)}</td>
					<td>{data[100].toFixed(2)}</td>
					<td>{data[200].toFixed(2)}</td>
					<td>{((data[20] + data[50] + data[100] + data[200]) / 4).toFixed(2)}</td>
				</>
			);
		}
	}

	return <tr>{content}</tr>;
};

const AverageRow = () => {
	const allLows = useSelector(selectAllLows);

	let sumLows = {
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

	if (allLows.length !== 0) {
		for (let i = 0; i < allLows.length; i++) {
			for (const [p, v] of Object.entries(allLows[i].data)) {
				sumLows[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumLows[20] / 8).toFixed(2)}</td>
				<td>{(sumLows[50] / 8).toFixed(2)}</td>
				<td>{(sumLows[100] / 8).toFixed(2)}</td>
				<td>{(sumLows[200] / 8).toFixed(2)}</td>
				<td>
					{(
						(sumLows[20] / 8 + sumLows[50] / 8 + sumLows[100] / 8 + sumLows[200] / 8) /
						4
					).toFixed(2)}
				</td>
			</>
		);
	}
	return <tr>{content}</tr>;
};

export default LowsTable;
