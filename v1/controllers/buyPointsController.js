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
	let ma = 0;
	for (const [k, v] of Object.entries(candleOHLC)) {
		ma = await getIntervalMA(k);
		for (const [p, pv] of Object.entries(buyPoints[k])) {
			buyPoints[k][p] = calculateBuyPoints(candleOHLC[k], p, ma[p]);
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
