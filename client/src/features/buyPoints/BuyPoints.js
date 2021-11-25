import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBuyPoints, selectAll, selectIds, selectById } from './buyPointsSlice';
import IntervalRow from '../IntervalRow';
const axios = require('axios');

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

const BuyPoints = () => {
	const dispatch = useDispatch();
	const maIds = useSelector(selectIds);
	const allBuyPoints = useSelector(selectAll);
	const maStatus = useSelector((state) => state.buyPoints.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchBuyPoints());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectById} />
	));

	return (
		<section>
			<h4>Buy Points</h4>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>buyPoints</th>
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

export default BuyPoints;
