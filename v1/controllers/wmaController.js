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

exports.setWMA = async (candleOHLC) => {
	for (const [k, v] of Object.entries(candleOHLC)) {
		for (const [p, pv] of Object.entries(weightedMa[k])) {
			weightedMa[k][p] = await calculateWeightedMa(candleOHLC[k], p);
		}
	}

	return weightedMa;
};

exports.getWMA = async () => {
	return weightedMa;
};

exports.getIntervalWMA = async (i) => {
	return weightedMa[i];
};
