import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMA, selectAllMA, selectMaIds, selectMaById } from './maSlice';
import IntervalRow from '../IntervalRow';
import AverageRow from '../AverageRow';

const MaTable = () => {
	const dispatch = useDispatch();
	const maIds = useSelector(selectMaIds);
	const allMa = useSelector(selectAllMA);
	const maStatus = useSelector((state) => state.ma.status);

	useEffect(() => {
		const fetchData = async () => {
			let res = await dispatch(fetchMA());
			return res;
		};
		fetchData();
	}, [dispatch]);

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectMaById} />
	));

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>MA</th>
					<th>20</th>
					<th>50</th>
					<th>100</th>
					<th>200</th>
					<th>AVG</th>
				</tr>
			</thead>
			<tbody>
				{content}
				{/* <AverageRow selector={selectAllMA} /> */}
			</tbody>
		</Table>
	);
};

export default MaTable;
