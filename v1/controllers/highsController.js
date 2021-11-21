const averageHighs = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateHighs = (intervalOHLC, period) => {
	let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;
	arrSplit.forEach((el) => {
		sum += parseFloat(el[2]);
	});

	return sum / period;
};

exports.setHighs = async (candleOHLC) => {
	for (const [k, v] of Object.entries(candleOHLC)) {
		for (const [p, pv] of Object.entries(averageHighs[k])) {
			averageHighs[k][p] = calculateHighs(candleOHLC[k], p);
		}
	}

	return averageHighs;
};

exports.getHighs = async () => {
	return averageHighs;
};

exports.getIntervalHighs = async (i) => {
	return averageHighs[i];
};
