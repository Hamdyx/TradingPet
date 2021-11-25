import { useSelector } from 'react-redux';

const AverageRow = ({ selector }) => {
	const allItems = useSelector(selector);

	let sum = {};

	//1h: {20: ??, 50: ??, 100: ??, 200: ??} || 1h: {up: ??, mid: ??, dn: ??}

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (allItems.length !== 0) {
		for (let i = 0; i < allItems.length; i++) {
			for (const [p, v] of Object.entries(allItems[i])) {
				sum[p] += v;
			}
		}
		content = (
			<>
				<td>AVG</td>
				<td>{(sum[20] / 8).toFixed(2)}</td>
				<td>{(sum[50] / 8).toFixed(2)}</td>
				<td>{(sum[100] / 8).toFixed(2)}</td>
				<td>{(sum[200] / 8).toFixed(2)}</td>
				<td>
					{((sum[20] / 8 + sum[50] / 8 + sum[100] / 8 + sum[200] / 8) / 4).toFixed(2)}
				</td>
			</>
		);
	}

	return <tr>{content}</tr>;
};

export default AverageRow;
