import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSellPoints, selectAll, selectIds, selectById } from './sellPointsSlice';
import IntervalRow from '../IntervalRow';
const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const SellPoints = () => {
	const dispatch = useDispatch();
	const sellPointsIds = useSelector(selectIds);
	const allSellPoints = useSelector(selectAll);
	const sellPointsStatus = useSelector((state) => state.sellPoints.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchSellPoints());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectById} />
	));

	return (
		<section>
			<h4>Sell Points</h4>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>sellPoints</th>
						<th>20</th>
						<th>50</th>
						<th>100</th>
						<th>200</th>
						<th>AVG</th>
					</tr>
				</thead>
				<tbody>{content}</tbody>
			</Table>
		</section>
	);
};

export default SellPoints;
