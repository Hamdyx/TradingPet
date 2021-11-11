const setMA = require('./maController').setMA;

const bollingerBands = {
	'1h': { upper: 0, middle: 0, lower: 0 },
	'2h': { upper: 0, middle: 0, lower: 0 },
	'4h': { upper: 0, middle: 0, lower: 0 },
	'6h': { upper: 0, middle: 0, lower: 0 },
	'8h': { upper: 0, middle: 0, lower: 0 },
	'12h': { upper: 0, middle: 0, lower: 0 },
	'1d': { upper: 0, middle: 0, lower: 0 },
	'1w': { upper: 0, middle: 0, lower: 0 },
};

const calculateBollingerBands = async (interval, candleOHLC, movingAverages) => {
	let _movingAverages = movingAverages;
	if (movingAverages[interval][20] === 0) {
		_movingAverages = await setMA(candleOHLC);
	}
	let ma20 = _movingAverages[interval][20];

	const calculateStdDev = async (interval) => {
		let _intervalOHLC = candleOHLC[interval];
		let split20 = Array.from(_intervalOHLC.slice(0, 20));
		let _k = 0;
		let n = 0;
		let Ex = 0;
		let Ex2 = 0;
		const add_variable = (x) => {
			if (n === 0) {
				_k = x;
			}

			n += 1;
			Ex += x - _k;
			Ex2 += (x - _k) * (x - _k);
		};

		const get_mean = () => {
			return _k + Ex / n;
		};

		const get_variance = () => {
			return (Ex2 - (Ex * Ex) / n) / (n - 1);
		};
		split20.forEach((el) => {
			add_variable(parseFloat(el[4]));
		});
		let _mean = get_mean();
		let _variance = get_variance();
		return Math.sqrt(_variance);
	};

	let stdDev = await calculateStdDev(interval);

	return {
		upper: ma20 + stdDev * 2,
		middle: ma20,
		lower: ma20 - stdDev * 2,
	};
};

exports.setBB = async (candleOHLC, movingAverages) => {
	let _movingAverages = movingAverages;
	if (_movingAverages['1h'][20] === 0) {
		_movingAverages = await setMA(candleOHLC);
	}
	for (const [k, v] of Object.entries(_movingAverages)) {
		bollingerBands[k] = await calculateBollingerBands(k, candleOHLC, _movingAverages);
	}

	return bollingerBands;
};

exports.getBB = async () => {
	return bollingerBands;
};

exports.getIntervalBB = async (i) => {
	return bollingerBands[i];
};
