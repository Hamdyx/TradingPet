import { useSelector } from 'react-redux';

const IntervalRow = ({ interval, selector }) => {
	const item = useSelector((state) => selector(state, interval));

	let content = (
		<>
			<td colSpan="6">Loading...</td>
		</>
	);

	if (item) {
		let data = Object.entries(item);
		let isValid = false;
		for (const [k, v] of data) {
			isValid = !!v;
		}
		if (isValid) {
			data = data.filter((el) => !isNaN(el[1]));
			let length = data.length;
			let sum = 0;
			data.forEach((el) => {
				sum += el[1];
			});

			data = data.map((el) => <td key={el[0]}>{el[1].toFixed(2)}</td>);
			content = (
				<>
					<td>{interval}</td>
					{data}

					<td>{(sum / length).toFixed(2)}</td>
				</>
			);
		}
	}

	return <tr>{content}</tr>;
};

export default IntervalRow;
