const tulind = require('tulind');
const getDataByIntervalPeriod =
	require('./binanceDataController').getDataByIntervalPeriod;
const calcBuyPoints = require('./buyPointsController').calcBuyPoints;
const calcAvgBuyPoints = require('./buyPointsController').calcAvgBuyPoints;
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

const calculateAverages = () => {
	return sum / 8;
};

exports.setMA = async (candleOHLC) => {
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumMa = 0;
		for (const [p, pv] of Object.entries(movingAverages[k])) {
			movingAverages[k][p] = calculateMA(candleOHLC[k], p);
			sumPeriods[p] += movingAverages[k][p];
			sumMa += movingAverages[k][p];
		}
		movingAverages[k]['avg'] = sumMa / 4;
		movingAverages[k]['buyPoints'] = await calcBuyPoints(
			candleOHLC[k],
			movingAverages[k]
		);
	}
	let avgBuyPoints = await calcAvgBuyPoints(movingAverages);
	movingAverages['avg'] = {
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
		buyPoints: avgBuyPoints,
	};

	return movingAverages;
};

exports.getMA = async () => {
	return movingAverages;
};

exports.getIntervalMA = async (i) => {
	return movingAverages[i];
};
exports.setSma = async (candleOHLC) => {
	let sumPeriods = { 20: 0, 50: 0, 100: 0, 200: 0, avg: 0 };
	for (const [k, v] of Object.entries(candleOHLC)) {
		let sumMa = 0;
		for (const [p, pv] of Object.entries(movingAverages[k])) {
			movingAverages[k][p] = calculateMA(candleOHLC[k], p);
			sumPeriods[p] += movingAverages[k][p];
			sumMa += movingAverages[k][p];
		}
		movingAverages[k]['avg'] = sumMa / 4;
		movingAverages[k]['buyPoints'] = await calcBuyPoints(
			candleOHLC[k],
			movingAverages[k]
		);
	}
	let avgBuyPoints = await calcAvgBuyPoints(movingAverages);
	movingAverages['avg'] = {
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
		buyPoints: avgBuyPoints,
	};

	return movingAverages;
};

const calcSma = async (period) => {
	let tempData = await getDataByIntervalPeriod('BTCUSDT', '1d', period);
	let close = [];
	tempData.forEach((el) => {
		close.push(el['close']);
	});
	let arr = [];

	let arrSplit = tempData.slice(19);
	// Calculate Simple Moving Average and return results as array where index 0 is oldest
	//tulind.indicators.['sma'].indicator([close], [20], (err, res) => {
	tulind.indicators.sma.indicator([close], [period], (err, res) => {
		arr = res[0];
		arr = arr.map((el, i) => {
			return {
				date: arrSplit[i].date,
				sma: el,
			};
		});
	});
	return arr;
};

exports.getSma = async (req, res) => {
	console.log(`getSma req.params`);
	console.log(req.params);
	let period = req.params.period;
	console.log(period);
	let sma = await calcSma(period);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: sma.length,
		data: {
			sma,
		},
	});
};

exports.getIntervalSma = async (i) => {
	return movingAverages[i];
};
