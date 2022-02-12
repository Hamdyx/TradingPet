/* const setMA = require('./maController').setMA;
const getMA = require('./maController').getMA;
const getIntervalMA = require('./maController').getIntervalMA; */

const buyPoints = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
	avg: { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const wmaBP = {};

const calculateBuyPoints = (intervalOHLC, period, indicator) => {
	/* let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;

	arrSplit.forEach((el) => {
		if (parseFloat(el[4]) < indicator) {
			sum++;
		}
	});

	return sum; */

	let lastCandle = intervalOHLC[0];
	let lastPrice = lastCandle[4];
	if (lastPrice < indicator) {
		let multiplier = (indicator - lastPrice) / indicator;
		return multiplier * period;
	}
	return 0;
};

exports.calcBuyPoints = async (intervalOHLC, indicator) => {
	let _buyPoints = {};
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };

	let sumBuy = 0;
	for (const [p, pv] of Object.entries(indicator)) {
		if (p !== 'avg') {
			_buyPoints[p] = calculateBuyPoints(intervalOHLC, p, indicator[p]);
			sumPeriods[p] += _buyPoints[p];
			sumBuy += _buyPoints[p];
		}
	}
	_buyPoints['avg'] = sumBuy / 4;
	return _buyPoints;
};

exports.calcAvgBuyPoints = async (indicator) => {
	let sumPoints = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	for (const [i, entry] of Object.entries(indicator)) {
		let _points = entry['buyPoints'];
		for (const [p, v] of Object.entries(_points)) {
			sumPoints[p] += v;
		}
	}
	let avgBuyPoints = {};
	for (const [p, v] of Object.entries(sumPoints)) {
		avgBuyPoints[p] = sumPoints[p] / 8;
	}

	return avgBuyPoints;
};

exports.setBuyPoints = async (candleOHLC, ma, wma) => {
	/* let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	// let ma = 0;
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumBuy = 0;
		// ma = await getIntervalMA(k);
		for (const [p, pv] of Object.entries(buyPoints[k])) {
			buyPoints[k][p] = calculateBuyPoints(candleOHLC[k], p, ma[k][p]);
			sumPeriods[p] += buyPoints[k][p];
			sumBuy += buyPoints[k][p];
		}
		buyPoints[k]['avg'] = sumBuy / 4;
	}

	buyPoints['avg'] = {
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

	return buyPoints; */
	for (const [i, entry] of Object.entries(ma)) {
		for (const [p, pv] of Object.entries(entry['buyPoints'])) {
			buyPoints[i][p] = (ma[i]['buyPoints'][p] + wma[i]['buyPoints'][p]) / 2;
			// sumPeriods[p] += buyPoints[k][p];
			// sumBuy += buyPoints[k][p];
		}
	}

	return buyPoints;
};

exports.getBuyPoints = async () => {
	return buyPoints;
};

exports.getIntervalBuyPoints = async (i) => {
	return buyPoints[i];
};
