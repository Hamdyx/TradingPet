import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWmA, selectAllWMA, selectWmaIds, selectWmaById } from './wmaSlice';
import IntervalRow from '../IntervalRow';
import AverageRow from '../AverageRow';

const WmaTable = () => {
	const dispatch = useDispatch();
	const wmaIds = useSelector(selectWmaIds);
	const allWma = useSelector(selectAllWMA);
	const wmaStatus = useSelector((state) => state.wma.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchWmA());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectWmaById} />
	));

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
				{/* <AverageRow selector={selectAllWMA} /> */}
			</tbody>
		</Table>
	);
};

export default WmaTable;
