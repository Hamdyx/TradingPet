import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchSupport,
	selectAllSupport,
	selectSupportIds,
	selectSupportById,
} from './supportSlice';

const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const SupportTable = () => {
	const dispatch = useDispatch();
	const supportIds = useSelector(selectSupportIds);
	const allSupport = useSelector(selectAllSupport);
	const supportStatus = useSelector((state) => state.support.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchSupport());
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
					<th>Support</th>
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
	const support = useSelector((state) => selectSupportById(state, interval));

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (support) {
		let data = support.data;
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
	const allSupport = useSelector(selectAllSupport);

	let sumSupport = {
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

	if (allSupport.length !== 0) {
		for (let i = 0; i < allSupport.length; i++) {
			for (const [p, v] of Object.entries(allSupport[i].data)) {
				sumSupport[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sumSupport[20] / 8).toFixed(2)}</td>
				<td>{(sumSupport[50] / 8).toFixed(2)}</td>
				<td>{(sumSupport[100] / 8).toFixed(2)}</td>
				<td>{(sumSupport[200] / 8).toFixed(2)}</td>
				<td>
					{(
						(sumSupport[20] / 8 +
							sumSupport[50] / 8 +
							sumSupport[100] / 8 +
							sumSupport[200] / 8) /
						4
					).toFixed(2)}
				</td>
			</>
		);
	}
	return <tr>{content}</tr>;
};

export default SupportTable;
