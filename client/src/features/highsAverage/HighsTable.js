import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHighs, selectAllHighs, selectHighsIds, selectHighById } from './highsSlice';

const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const HighsTable = () => {
	const dispatch = useDispatch();
	const HighsIds = useSelector(selectHighsIds);
	const allHighs = useSelector(selectAllHighs);
	const highsStatus = useSelector((state) => state.highs.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchHighs());
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
					<th>Highs</th>
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
	const high = useSelector((state) => selectHighById(state, interval));

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
	const allHighs = useSelector(selectAllHighs);

	let sumHighs = {
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

	if (allHighs.length !== 0) {
		for (let i = 0; i < allHighs.length; i++) {
			for (const [p, v] of Object.entries(allHighs[i].data)) {
				sumHighs[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumHighs[20] / 8).toFixed(2)}</td>
				<td>{(sumHighs[50] / 8).toFixed(2)}</td>
				<td>{(sumHighs[100] / 8).toFixed(2)}</td>
				<td>{(sumHighs[200] / 8).toFixed(2)}</td>
				<td>
					{(
						(sumHighs[20] / 8 +
							sumHighs[50] / 8 +
							sumHighs[100] / 8 +
							sumHighs[200] / 8) /
						4
					).toFixed(2)}
				</td>
			</>
		);
	}
	return <tr>{content}</tr>;
};

export default HighsTable;
