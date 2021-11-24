import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBB, selectAllBB, selectBbIds, selectBbById } from './bbSlice';
import IntervalRow from '../IntervalRow';

const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const BbTable = () => {
	const dispatch = useDispatch();
	const bbIds = useSelector(selectBbIds);
	const allBB = useSelector(selectAllBB);
	const bbStatus = useSelector((state) => state.bb.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchBB());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectBbById} />
	));

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>BB</th>
					<th>upper</th>
					<th>middle</th>
					<th>lower</th>

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
	const allBb = useSelector(selectAllBB);

	let sumBB = {
		upper: 0,
		middle: 0,
		lower: 0,
	};

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (allBb.length !== 0) {
		for (let i = 0; i < allBb.length; i++) {
			for (const [p, v] of Object.entries(allBb[i])) {
				sumBB[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumBB['upper'] / 8).toFixed(2)}</td>
				<td>{(sumBB['middle'] / 8).toFixed(2)}</td>
				<td>{(sumBB['lower'] / 8).toFixed(2)}</td>

				<td>
					{((sumBB['upper'] / 8 + sumBB['middle'] / 8 + sumBB['lower'] / 8) / 4).toFixed(
						2
					)}
				</td>
			</>
		);
	}
	return <tr>{content}</tr>;
};

export default BbTable;
