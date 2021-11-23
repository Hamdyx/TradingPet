const support = {
	'1h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'2h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'4h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'6h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'8h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'12h': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1d': { 20: 0, 50: 0, 100: 0, 200: 0 },
	'1w': { 20: 0, 50: 0, 100: 0, 200: 0 },
};

const calculateSupport = (intervalOHLC, period) => {
	let arrSplit = Array.from(intervalOHLC.slice(0, period));
	let sum = 0;
	let n = 0;
	arrSplit.forEach((el) => {
		if (el[4] < el[1]) {
			sum += parseFloat(el[4]) + parseFloat(el[3]);
			n += 2;
		}
	});

	return sum / n;
};

exports.setSupport = async (candleOHLC) => {
	for (const [k, v] of Object.entries(candleOHLC)) {
		for (const [p, pv] of Object.entries(support[k])) {
			support[k][p] = calculateSupport(candleOHLC[k], p);
		}
	}

	return support;
};

exports.getSupport = async () => {
	return support;
};

exports.getIntervalSupport = async (i) => {
	return support[i];
};
