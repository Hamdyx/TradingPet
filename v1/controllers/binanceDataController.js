// Chart Intervals:
// m -> minutes; h -> hours; d -> days; w -> weeks; M -> months
// 1m 3m 5m 15m 30m
// 1h 2h 4h 6h 8h 12h
// 1d 3d 1w 1M
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

async function setIntervalData(symbol, interval, period) {
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
	console.log(`timeMultiplier: ${timeMultiplier}`);
	console.log(`intervalToHours: ${intervalToHours}`);
	console.log(`period: ${period}`);
	startTime.setHours(
		startTime.getHours() - timeMultiplier * intervalToHours * period * 2
	);
	endTime = endTime.getTime();
	startTime = startTime.getTime();

	console.log(`startTime: ${startTime}`);
	console.log(`endTime: ${endTime}`);
	try {
		const response = await axios.get(
			`${binanceEndpoint}/${_api}?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
		);
		// let arr = Array.from(response.data).reverse();
		let arr = Array.from(response.data);
		arr = arr.map((el) => {
			return {
				date: el[0],
				open: el[1],
				high: el[2],
				low: el[3],
				close: el[4],
				volume: el[5],
			};
		});

		return arr;
	} catch (err) {
		console.log(err);
		return toString(err);
	}
}

exports.getDataByIntervalPeriod = async (symbol, interval, period) => {
	let data = await setIntervalData(symbol, interval, period);
	return data;
};

// DEV
// read data from local files
// if latest data is available
//		fetch without sending get request to binance api
//else: get data from binance api and append to local file

const candles = {
	'1h': [],
	'2h': [],
	'4h': [],
	'6h': [],
	'8h': [],
	'12h': [],
	'1d': [],
	'1w': [],
};

/* const candles = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/binance-${interval}Candles-data.json`)
); */

exports.getAllData = async (req, res) => {
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			data: 'data',
		},
	});
};

exports.getDataByInterval = async (req, res) => {
	console.log('getDataByInterval');
	let { symbol, interval } = req.params;

	let candles = await setIntervalData(symbol, interval, 5);
	// let data = await setIntervalData('BTCUSDT', '1h', 5);
	// return data;

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: candles.length,
		data: {
			candles,
		},
	});

	console.log('respond rent');

	// save data to local storage
	console.log(`writing ${interval} binance data to binance-candles-data.json`);
	let _data = Array.from(candles);
	saveDataToLocal(_data, interval);
	console.log('done writing binance data');
	// save data to local storage
};

async function saveDataToLocal(data, interval) {
	fs.writeFile(
		`${__dirname}/../dev-data/binance-${interval}Candles-data.json`,
		JSON.stringify(data, null, 4),
		(err) => {
			if (err) {
				console.log('error writing binance data');
				console.log(err);
				console.log(toString(err));
				return toString(err);
			} else {
				console.log('Writing data done successfuly');
			}
		}
	);
}
