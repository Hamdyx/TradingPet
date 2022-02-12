const axios = require('axios');
const fs = require('fs');
const XLSX = require('xlsx');

// const data = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/jan2022.json`));

const TestXlsx = () => {
	let workbook = XLSX.readFile(`${__dirname}/../../dev-data/futures-jan2022.xlsx`);
	let sheet_name_list = workbook.SheetNames;
	let data = [];
	sheet_name_list.forEach((sh) => {
		let worksheet = workbook.Sheets[sh];
		let headers = {};
		for (z in worksheet) {
			if (z[0] === '!') continue;
			// parse out the column, row, and value
			let col = z.substring(0, 1);
			let row = z.substring(1);
			let value = worksheet[z].v;

			// store header names
			if (row == 1) {
				headers[col] = value;
				continue;
			}

			if (!data[row]) data[row] = {};
			data[row][headers[col]] = value;
		}
		// drop those first two rows which are empty
		data.shift();
		data.shift();
		// console.log(data);
	});
	return data;
};

const data = TestXlsx();

// const data = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/futures-jan2022.json`));

let _dataRev = Array.from(data).reverse();
/* console.log(data[0]);
console.log(_dataRev[0]); */

/* const calcMonthProfit = () => {
	let sum = 0;
	_dataRev.forEach((el) => {
		sum += parseFloat(el['Realized Profit']);
	});
	console.log(`Total Month Realized Profit: ${sum}`);
};
calcMonthProfit();
 */
const calcWeekProfit = () => {
	const checkDate = (d, f, t) => {
		let itemDate = new Date(d);
		return (
			itemDate.toLocaleDateString() >= f.toLocaleDateString() &&
			itemDate.toLocaleDateString() < t.toLocaleDateString()
		);
	};

	let sum = 0;
	let count = 0;
	let currWeek = `week${count}`;
	let today = new Date();
	let to = new Date();
	let nextMon = new Date();
	// if (to.getHours() >= 2) nextMon.setDate(nextMon.getDate() +1)
	if (to.getHours() < 2) nextMon.setHours(2, 0, 0, 0);

	let nextDay = nextMon.toGMTString().split(',');

	while (nextDay[0] !== 'Mon') {
		nextMon.setDate(nextMon.getDate() + 1);
		nextDay = nextMon.toGMTString().split(',');
	}
	to = nextMon;

	/* do {
		nextMon.setDate(nextMon.getDate() + 1);
		nextDay = nextMon.toGMTString().split(',');
	} while (nextDay[0] !== 'Mon'); */
	let from = new Date();
	let prevMon = new Date();
	if (from.getHours() < 2) {
		prevMon.setDate(prevMon.getDate() - 1);
		prevMon.setHours(2, 0, 0, 0);
	} else prevMon.setHours(2, 0, 0, 0);
	let prevDay = prevMon.toGMTString().split(',');
	if (prevDay[0] !== 'Mon') {
		do {
			prevMon.setDate(prevMon.getDate() - 1);
			prevDay = prevMon.toGMTString().split(',');
		} while (prevDay[0] !== 'Mon');
		from = prevMon;
	}
	let weekData = _dataRev.filter((el) => checkDate(el['Date(UTC)'], from, to));
	weekData.forEach((el) => {
		sum += parseFloat(el['Realized Profit']) * parseFloat(el['Price']);
	});
	console.log(`Futures Week From: ${from}`);
	console.log(`Futures Week To: ${to}`);
	console.log(`Futures Week Realized Profit: ${sum}`);
	return sum;
};

const calcTodayProfit = () => {
	let sum = 0;
	const checkDate = (d) => {
		let d1 = new Date(d);
		let today = new Date();
		return today.toLocaleDateString() === d1.toLocaleDateString();
	};
	let todayData = _dataRev.filter((el) => checkDate(el['Date(UTC)']));
	todayData.forEach((el) => {
		sum += parseFloat(el['Realized Profit']);
	});
	console.log(`Total Today Realized Profit: ${sum}`);
};
// calcTodayProfit();

/* let testDate = new Date();
testDate.setDate(testDate.getDate() - 1);
testDate.setHours(2);
testDate.setMinutes(0);
testDate.setSeconds(0);
testDate.setMilliseconds(0);

calcDayProfit(testDate); */

// 1 data s
exports.getAllData = async (req, res) => {
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			msg: 'Tradex Futures is working',
		},
	});
};
// 1 data e

// 1 data s
exports.getApiReq = async (req, res) => {
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data: {
			msg: 'Tradex Futures API is working',
		},
	});
};
// 1 data e
const calcDayProfit = (day) => {
	// console.log('calcDayProfit');
	// console.log(day);
	let _day = new Date(parseInt(day));
	// console.log(_day);
	let sum = 0;
	const checkDate = (d) => {
		let itemDate = new Date(d);
		let _item = itemDate.toISOString().split('T')[0];
		let _check = _day.toISOString().split('T')[0];
		return _check === _item;
	};
	let dayData = _dataRev.filter((el) => checkDate(el['Date(UTC)']));
	dayData.forEach((el) => {
		sum += parseFloat(el['Realized Profit']) * parseFloat(el['Price']);
	});
	console.log(
		`Total ${_day.toISOString().split('T')[0]} Futures Realized Profit: ${sum}`
	);
	return sum;
};
// 1 dayData s
exports.getFuturesDay = async (req, res) => {
	let day = req.params.date || new Date();
	// console.log('getDayData');
	// console.log(req.params);
	// console.log(day);
	const data = calcDayProfit(day);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data,
	});
};
// 1 dayData e
const calcMonthProfit = (m) => {
	let sum = 0;
	_dataRev.forEach((el) => {
		sum += parseFloat(el['Realized Profit']) * parseFloat(el['Price']);
	});
	console.log(`Total Month Futures Realized Profit: ${sum}`);
	return sum;
};
// calcMonthProfit();
// 1 monthData s
exports.getFuturesWeek = async (req, res) => {
	let month = req.params.date || new Date();
	// console.log('getMonthData');
	// console.log(req.params);
	// console.log(month);
	const data = calcWeekProfit(month);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data,
	});
};
// 1 monthData e
// 1 monthData s
exports.getFuturesMonth = async (req, res) => {
	let month = req.params.date || new Date();
	// console.log('getMonthData');
	// console.log(req.params);
	// console.log(month);
	const data = calcMonthProfit(month);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data,
	});
};
// 1 monthData e
