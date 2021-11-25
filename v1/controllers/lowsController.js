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
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumLow = 0;
		for (const [p, pv] of Object.entries(averageLows[k])) {
			averageLows[k][p] = calculateLows(candleOHLC[k], p);
			sumPeriods[p] += averageLows[k][p];
			sumLow += averageLows[k][p];
		}
		averageLows[k]['avg'] = sumLow / 4;
	}

	averageLows['avg'] = {
		20: sumPeriods[20] / 8,
		50: sumPeriods[50] / 8,
		100: sumPeriods[100] / 8,
		200: sumPeriods[200] / 8,
		avg:
			(sumPeriods[20] / 8 +
				sumPeriods[50] / 8 +
				sumPeriods[100] / 8 +
				sumPeriods[200] / 8) /
			4,
	};

	return averageLows;
};

exports.getLows = async () => {
	return averageLows;
};

exports.getIntervalLows = async (i) => {
	return averageLows[i];
};
