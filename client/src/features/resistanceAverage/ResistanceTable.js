import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchResistance,
	selectAllResistance,
	selectResistanceIds,
	selectResistanceById,
} from './resistanceSlice';

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
	const content = intervals.map((el) => <IntervalRow key={el} interval={el} />);

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

const IntervalRow = ({ interval }) => {
	const dispatch = useDispatch();
	const resistance = useSelector((state) => selectResistanceById(state, interval));

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (resistance) {
		let data = resistance.data;
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
			for (const [p, v] of Object.entries(allResistance[i].data)) {
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
