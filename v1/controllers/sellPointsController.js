const setMA = require('./maController').setMA;
const getMA = require('./maController').getMA;
const getIntervalMA = require('./maController').getIntervalMA;

const sellPoints = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateSellPoints = (intervalOHLC, period, ma) => {
	let lastCandle = intervalOHLC[0];
	let lastPrice = lastCandle[4];
	if (lastPrice > ma) {
		let multiplier = (lastPrice - ma) / lastPrice;
		return multiplier * period;
	}
	return 0;
};

exports.setSellPoints = async (candleOHLC) => {
	let ma = 0;
	for (const [k, v] of Object.entries(candleOHLC)) {
		ma = await getIntervalMA(k);
		for (const [p, pv] of Object.entries(sellPoints[k])) {
			sellPoints[k][p] = calculateSellPoints(candleOHLC[k], p, ma[p]);
		}
	}

	return sellPoints;
};

exports.getSellPoints = async () => {
	return sellPoints;
};

exports.getIntervalSellPoints = async (i) => {
	return sellPoints[i];
};
