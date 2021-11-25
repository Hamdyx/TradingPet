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
import AverageRow from '../AverageRow';

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

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
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
				{/* <AverageRow selector={selectAllResistance} /> */}
			</tbody>
		</Table>
	);
};

export default ResistanceTable;
