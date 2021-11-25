const fs = require('fs');
const axios = require('axios');

const binanceEndpoint = 'https://api.binance.com';

const candleOHLC = {
	'1h': [],
	'2h': [],
	'4h': [],
	'6h': [],
	'8h': [],
	'12h': [],
	'1d': [],
	'1w': [],
};

async function getBinanceOHLC(symbol, interval) {
	const _api = 'api/v3/klines';
	let intervalToHours = 1;
	if (interval[1] === 'd') {
		intervalToHours = 24;
	} else if (interval[1] === 'w') {
		intervalToHours = 24 * 7;
	} else {
		intervalToHours = 1;
	}
	let timeMultiplier = parseInt(interval);
	let endTime = new Date();
	let startTime = new Date();
	startTime.setHours(startTime.getHours() - timeMultiplier * intervalToHours * 200);
	endTime = endTime.getTime();
	startTime = startTime.getTime();

	try {
		const response = await axios.get(
			`${binanceEndpoint}/${_api}?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
		);

		return Array.from(response.data).reverse();
	} catch (err) {
		console.log(err);
		return toString(err);
	}
}

exports.setCandleOHLC = async () => {
	for (const [k, v] of Object.entries(candleOHLC)) {
		candleOHLC[k] = await getBinanceOHLC('BTCUSDT', k);
	}
	return candleOHLC;
};

exports.getCandleOHLC = async () => {
	return candleOHLC;
};

exports.getIntervalCandleOHLC = async (interval) => {
	return candleOHLC[interval];
};

/* exports.getAllData = async (req, res) => {
	// console.log('getAllData controller called');
	let _candleOHLC = await setData();

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			candleOHLC: _candleOHLC,
		},
	});
}; */

/* const getCandleOHLC = async (symbol = 'BTCUSDT', interval) => {
	return candleOHLC[interval];
}; */

/* const candleOHLC = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tasks-simple.json`)
); */

/* const readCandleOHLC = (interval) => {
	return JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/${interval}OHLC.json`));
}; */
