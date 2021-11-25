const resistance = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateResistance = (intervalOHLC, period) => {
	let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;
	let n = 0;
	arrSplit.forEach((el) => {
		if (el[4] > el[1]) {
			sum += parseFloat(el[4]) + parseFloat(el[2]);
			n += 2;
		}
	});

	return sum / n;
};

exports.setResistance = async (candleOHLC) => {
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumRes = 0;
		for (const [p, pv] of Object.entries(resistance[k])) {
			resistance[k][p] = calculateResistance(candleOHLC[k], p);
			sumPeriods[p] += resistance[k][p];
			sumRes += resistance[k][p];
		}
		resistance[k]['avg'] = sumRes / 4;
	}

	resistance['avg'] = {
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

	return resistance;
};

exports.getResistance = async () => {
	return resistance;
};

exports.getIntervalResistance = async (i) => {
	return resistance[i];
};
