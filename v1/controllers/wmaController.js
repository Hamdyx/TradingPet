const weightedMa = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateWeightedMa = async (intervalOHLC, period) => {
	let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sumWma = 0;
	let sumWeight = 0;
	let weight = parseInt(period);

	for (let i = 0; i < arrSplit.length; i++) {
		sumWeight += weight;
		let el = arrSplit[i];
		sumWma += parseFloat(el[4]) * weight;
		weight--;
	}

	return sumWma / sumWeight;
};

const calculateAverages = () => {
	return sum / 8;
};

exports.setWMA = async (candleOHLC) => {
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumWma = 0;
		for (const [p, pv] of Object.entries(weightedMa[k])) {
			weightedMa[k][p] = await calculateWeightedMa(candleOHLC[k], p);
			sumPeriods[p] += weightedMa[k][p];
			sumWma += weightedMa[k][p];
		}
		weightedMa[k]['avg'] = sumWma / 4;
	}
	weightedMa['avg'] = {
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

	return weightedMa;
};

exports.getWMA = async () => {
	return weightedMa;
};

exports.getIntervalWMA = async (i) => {
	return weightedMa[i];
};
