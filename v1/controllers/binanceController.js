const fs = require('fs');
const axios = require('axios');

const { setMA, getMA, getIntervalMA } = require('./maController');
const { setWMA, getWMA, getIntervalWMA } = require('./wmaController');
const { setBB, getBB, getIntervalBB } = require('./bbController');
const { setCandleOHLC, getCandleOHLC } = require('./binanceDataController');

const binanceEndpoint = 'https://api.binance.com';

// 1 data s
// ('/') > send get requests to get canddleOHLC for all time frames and store them in variable
exports.getAllData = async (req, res) => {
	let candleOHLC = await getCandleOHLC();
	if (candleOHLC['1h'].length === 0) {
		candleOHLC = await setCandleOHLC();
	}

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			candleOHLC,
		},
	});
};
// 1 data e

// 1 MA s
// GET ('/movingAverages')
exports.getMovingAverages = async (req, res) => {
	let ma = await getMA();

	if (ma['1h'][20] === 0) {
		let candleOHLC = await getCandleOHLC();
		if (candleOHLC['1h'].length === 0) {
			candleOHLC = await setCandleOHLC();
		}
		ma = await setMA(candleOHLC);
	}

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			ma,
		},
	});
};
// 1 MA e
// 1 WMA S
// GET ('/weightedMovingAverages')
exports.getWeightedMa = async (req, res) => {
	let wma = await getWMA();

	if (wma['1h'][20] === 0) {
		console.log('wma is not initialised');
		let candleOHLC = await getCandleOHLC();

		if (candleOHLC['1h'].length === 0) {
			candleOHLC = await setCandleOHLC();
		}
		wma = await setWMA(candleOHLC);
	}

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			wma,
		},
	});
};
// 1 WMA E
// 1 bb s
// GET ('/bollingerBands')
exports.getBollingerBands = async (req, res) => {
	let ma = await getMA();
	let candleOHLC = await getCandleOHLC();
	if (ma['1h'][20] === 0) {
		if (candleOHLC['1h'].length === 0) {
			candleOHLC = await setCandleOHLC();
		}
		ma = await setMA(candleOHLC);
	}

	let bb = await getBB();
	if (bb['1h']['middle'] === 0) {
		bb = await setBB(candleOHLC, ma);
	}

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			bb,
		},
	});
};
// 1 bb e
// 2 MA s
// GET ('/movingAverages/:interval')
exports.movingAverageByInterval = async (req, res) => {
	let interval = req.params.interval;
	let ma = await getIntervalMA(interval);

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			ma,
		},
	});
};
// 2 MA e
// 2 WMA S
// GET ('/weightedMovingAverages/:interval')
exports.getWeightedMaByInterval = async (req, res) => {
	let interval = req.params.interval;
	let wma = await getIntervalWMA(interval);

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			wma,
		},
	});
};
// 2 WMA E
// 2 bb s
// GET ('/bollingerBands/:interval')
exports.getBollingerBandsByInterval = async (req, res) => {
	let interval = req.params.interval;
	let bollingerBands = await getIntervalBB(interval);

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			bollingerBands,
		},
	});
};
// 2 bb e

exports.checkId = (req, res, next, val) => {
	// check the id of req.params.id
	console.log('checkId controller called');
	next();
};

exports.checkBody = (req, res, next) => {
	console.log('checkBody controller called');
	next();
};

exports.checkBinanceConnectivity = (req, res) => {
	// check the id of req.params.id
	console.log('checkConnectivity controller called');

	async function checkConnectivity() {
		try {
			const response = await axios.get(`${binanceEndpoint}/api/v3/time`);
			// console.log(response);
			// res.status(200).json({
			// 	status: 'success',
			// 	requestedAt: req.requestTime,
			// 	results: 'test',
			// 	data: {
			// 		data: response,
			// 	},
			// });
		} catch (error) {
			console.error(error);
		}
	}
	checkConnectivity();
};

exports.getData = (req, res) => {
	console.log('getData controller called');
	res.status(200).json({
		status: 'success',
		data: {
			data: 'IdData',
		},
	});
};

exports.createData = (req, res) => {
	console.log('createData controller called');
	res.status(201).json({
		status: 'success',
		data: {
			data: 'newData',
		},
	});
};

exports.updateData = (req, res) => {
	console.log('updateData controller called');
	res.status(200).json({
		status: 'success',
		data: {
			data: 'updatedData',
		},
	});
};

exports.deleteData = (req, res) => {
	console.log('deleteData controller called');
	res.status(204).json({
		status: 'success',
		data: null,
	});
};
