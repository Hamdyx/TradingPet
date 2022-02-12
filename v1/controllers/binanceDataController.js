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
