import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWmA, selectAllWMA, selectWmaIds, selectWmaById } from './wmaSlice';

const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const WmaTable = () => {
	const dispatch = useDispatch();
	const wmaIds = useSelector(selectWmaIds);
	const allWma = useSelector(selectAllWMA);
	const wmaStatus = useSelector((state) => state.ma.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchWmA());
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
					<th>WMA</th>
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
	const wma = useSelector((state) => selectWmaById(state, interval));

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (wma) {
		let data = wma.data;
		// console.log('wma data');
		// console.log(data);
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
	const allWma = useSelector(selectAllWMA);

	let sumWMA = {
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

	if (allWma.length !== 0) {
		for (let i = 0; i < allWma.length; i++) {
			for (const [p, v] of Object.entries(allWma[i].data)) {
				sumWMA[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumWMA[20] / 8).toFixed(2)}</td>
				<td>{(sumWMA[50] / 8).toFixed(2)}</td>
				<td>{(sumWMA[100] / 8).toFixed(2)}</td>
				<td>{(sumWMA[200] / 8).toFixed(2)}</td>
				<td>
					{(
						(sumWMA[20] / 8 + sumWMA[50] / 8 + sumWMA[100] / 8 + sumWMA[200] / 8) /
						4
					).toFixed(2)}
				</td>
			</>
		);
	}

	return <tr>{content}</tr>;
};

export default WmaTable;
