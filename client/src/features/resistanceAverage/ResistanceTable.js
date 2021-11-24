import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchResistance,
	selectAllResistance,
	selectResistanceIds,
	selectResistanceById,
} from './resistanceSlice';
import IntervalRow from '../IntervalRow';
const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const ResistanceTable = () => {
	const dispatch = useDispatch();
	const resistanceIds = useSelector(selectResistanceIds);
	const allResistance = useSelector(selectAllResistance);
	const resistanceStatus = useSelector((state) => state.resistance.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchResistance());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectResistanceById} />
	));

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>Resistance</th>
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
	const allResistance = useSelector(selectAllResistance);

	let sumResistance = {
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

	if (allResistance.length !== 0) {
		for (let i = 0; i < allResistance.length; i++) {
			for (const [p, v] of Object.entries(allResistance[i])) {
				sumResistance[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumResistance[20] / 8).toFixed(2)}</td>
				<td>{(sumResistance[50] / 8).toFixed(2)}</td>
				<td>{(sumResistance[100] / 8).toFixed(2)}</td>
				<td>{(sumResistance[200] / 8).toFixed(2)}</td>
				<td>
					{(
						(sumResistance[20] / 8 +
							sumResistance[50] / 8 +
							sumResistance[100] / 8 +
							sumResistance[200] / 8) /
						4
					).toFixed(2)}
				</td>
			</>
		);
	}
	return <tr>{content}</tr>;
};

export default ResistanceTable;
