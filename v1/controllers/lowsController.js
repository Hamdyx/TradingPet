const averageLows = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateLows = (intervalOHLC, period) => {
	let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;
	arrSplit.forEach((el) => {
		sum += parseFloat(el[3]);
	});

	return sum / period;
};

exports.setLows = async (candleOHLC) => {
	for (const [k, v] of Object.entries(candleOHLC)) {
		for (const [p, pv] of Object.entries(averageLows[k])) {
			averageLows[k][p] = calculateLows(candleOHLC[k], p);
		}
	}

	return averageLows;
};

exports.getLows = async () => {
	return averageLows;
};

exports.getIntervalLows = async (i) => {
	return averageLows[i];
};
