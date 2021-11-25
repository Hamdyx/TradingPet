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
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	let ma = 0;
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumSell = 0;
		ma = await getIntervalMA(k);
		for (const [p, pv] of Object.entries(sellPoints[k])) {
			sellPoints[k][p] = calculateSellPoints(candleOHLC[k], p, ma[p]);
			sumPeriods[p] += sellPoints[k][p];
			sumSell += sellPoints[k][p];
		}
		sellPoints[k]['avg'] = sumSell / 4;
	}
	sellPoints['avg'] = {
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

	return sellPoints;
};

exports.getSellPoints = async () => {
	return sellPoints;
};

exports.getIntervalSellPoints = async (i) => {
	return sellPoints[i];
};
