const setMA = require('./maController').setMA;
const getMA = require('./maController').getMA;
const getIntervalMA = require('./maController').getIntervalMA;

const buyPoints = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateBuyPoints = (intervalOHLC, period, ma) => {
	/* let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;

	arrSplit.forEach((el) => {
		if (parseFloat(el[4]) < ma) {
			sum++;
		}
	});

	return sum; */

	let lastCandle = intervalOHLC[0];
	let lastPrice = lastCandle[4];
	if (lastPrice < ma) {
		let multiplier = (ma - lastPrice) / ma;
		return multiplier * period;
	}
	return 0;
};

exports.setBuyPoints = async (candleOHLC) => {
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	let ma = 0;
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumBuy = 0;
		ma = await getIntervalMA(k);
		for (const [p, pv] of Object.entries(buyPoints[k])) {
			buyPoints[k][p] = calculateBuyPoints(candleOHLC[k], p, ma[p]);
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

	return buyPoints;
};

exports.getBuyPoints = async () => {
	return buyPoints;
};

exports.getIntervalBuyPoints = async (i) => {
	return buyPoints[i];
};
