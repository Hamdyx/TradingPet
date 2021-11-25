import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHighs, selectAllHighs, selectHighsIds, selectHighById } from './highsSlice';
import IntervalRow from '../IntervalRow';
import AverageRow from '../AverageRow';

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

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectHighById} />
	));

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
				{/* <AverageRow selector={selectAllHighs} /> */}
			</tbody>
		</Table>
	);
};

export default HighsTable;
