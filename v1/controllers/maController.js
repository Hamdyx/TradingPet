const movingAverages = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateMA = (intervalOHLC, period) => {
	let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;
	arrSplit.forEach((el) => {
		sum += parseFloat(el[4]);
	});

	return sum / period;
};

exports.setMA = async (candleOHLC) => {
	for (const [k, v] of Object.entries(candleOHLC)) {
		for (const [p, pv] of Object.entries(movingAverages[k])) {
			movingAverages[k][p] = calculateMA(candleOHLC[k], p);
		}
	}

	return movingAverages;
};

exports.getMA = async () => {
	return movingAverages;
};

exports.getIntervalMA = async (i) => {
	return movingAverages[i];
};
