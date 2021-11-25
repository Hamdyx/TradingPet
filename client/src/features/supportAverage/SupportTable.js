import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchSupport,
	selectAllSupport,
	selectSupportIds,
	selectSupportById,
} from './supportSlice';
import IntervalRow from '../IntervalRow';
import AverageRow from '../AverageRow';

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

	const intervals = ['1h', '2h', '4h', '6h', '8h', '12h', '1d', '1w', 'avg'];
	const content = intervals.map((el) => (
		<IntervalRow key={el} interval={el} selector={selectSupportById} />
	));

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
				{/* <AverageRow selector={selectAllSupport} /> */}
			</tbody>
		</Table>
	);
};

export default SupportTable;
