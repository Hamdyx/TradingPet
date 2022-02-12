const axios = require('axios');
const fs = require('fs');
const XLSX = require('xlsx');

// const data = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/jan2022.json`));

const TestXlsx = () => {
	let workbook = XLSX.readFile(`${__dirname}/../../dev-data/perpetual-feb2022.xlsx`);
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

let _dataRev = Array.from(data).reverse();
/* console.log(data[0]);
console.log(_dataRev[0]); */

/*
	if today === 'Mon'
		let nextMon = today.setDate(+n) while nextMon === 'Mon' && !== today
		today >= date < nextMon
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
	if (to.getHours() < 2) nextMon.setHours(2, 0, 0, 0);
	let nextDay = nextMon.toGMTString().split(',');
	while (nextDay[0] !== 'Mon') {
		nextMon.setDate(nextMon.getDate() + 1);
		nextDay = nextMon.toGMTString().split(',');
	}
	to = nextMon;
	/* do {
		nextMon.setDate(nextMon.getDate() + 1);
		nextDay = nextMon.toDateString().split(' ');
	} while (nextDay[0] !== 'Mon'); */
	let from = new Date();
	let prevMon = new Date(from.toLocaleDateString());

	if (from.getHours() < 2) {
		prevMon.setDate(prevMon.getDate() - 1);
		prevMon.setHours(2, 0, 0, 0);
	} else prevMon.setHours(2, 0, 0, 0);

	let prevDay = prevMon.toDateString().split(' ');
	if (prevDay[0] !== 'Mon') {
		do {
			prevMon.setDate(prevMon.getDate() - 1);
			prevDay = prevMon.toGMTString().split(',');
		} while (prevDay[0] !== 'Mon');
		from = prevMon;
	}
	let weekData = _dataRev.filter((el) => checkDate(el['Date(UTC)'], from, to));
	weekData.forEach((el) => {
		sum += parseFloat(el['Realized Profit']);
	});
	console.log(`Perpetual Week From: ${prevMon}`);
	console.log(`Perpetual Week To: ${to}`);
	console.log(`Perpetual Week Realized Profit: ${sum}`);
	return sum;
};

/* const calcWeeksProfit = () => {
	const checkDate = (d) => {
		let d1 = new Date(d);
		let today = new Date();
		return today.toLocaleDateString() === d1.toLocaleDateString();
	};

	let weeksProfit = {
		week0: 0,
		week1: 0,
		week2: 0,
		week3: 0,
		week4: 0,
	};
	let sum = 0;
	let count = 0;
	let currWeek = `week${count}`;
	_dataRev.forEach((el) => {
		let testDate = new Date(el['Date(UTC)']);
		let _day = testDate.toGMTString().split(',')[0];
		if (weeksProfit[week0] === 0) {
			let weekData = _dataRev.filter((el) => checkDate(el['Date(UTC)']));
		}
		if (_day === 'Mon') {
			console.log(_day);
			console.log(testDate);
			if (weeksProfit[week0] !== 0) {
				count++;
				currWeek = `week${count}`;
			}
		}
		sum += parseFloat(el['Realized Profit']);
		weeksProfit[currWeek] += parseFloat(el['Realized Profit']);
	});
	console.log(`Total Weeks Realized Profit: `);
	console.log(weeksProfit);
}; */
// calcWeeksProfit();

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
			msg: 'Tradex server is working',
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
			msg: 'Tradex server is working',
		},
	});
};
// 1 data e
const calcDayProfit = (day) => {
	// console.log('calcDayProfit');
	// console.log(day);
	// let _day = new Date(parseInt(day));
	let _day = new Date(day);
	// console.log(_day);
	let sum = 0;
	const checkDate = (d) => {
		let itemDate = new Date(d);
		let _item = itemDate.toISOString().split('T')[0];
		let _check = _day.toISOString().split('T')[0];
		return _check === _item;
	};
	let dayData = _dataRev.filter((el) => checkDate(el['Date(UTC)']));
	let nTrades = 0;
	let winTrades = 0;
	let lossTrades = 0;
	dayData.forEach((el) => {
		let pnl = parseFloat(el['Realized Profit']);
		if (pnl !== 0) {
			nTrades++;
			if (pnl > 0) winTrades++;
			if (pnl < 0) lossTrades++;
		}
		sum += pnl;
	});
	console.log(`Total ${_day.toISOString().split('T')[0]} Realized Profit: ${sum}`);
	return { sum, nTrades, winTrades, lossTrades };
};
// 1 dayData s
exports.getDayData = async (req, res) => {
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
		sum += parseFloat(el['Realized Profit']);
	});
	console.log(`Total Month Realized Profit: ${sum}`);
	return sum;
};
// calcMonthProfit();
// 1 weekData s
exports.getWeekData = async (req, res) => {
	let week = req.params.date || new Date();
	// console.log('getMonthData');
	// console.log(req.params);
	// console.log(month);
	const data = calcWeekProfit(week);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data,
	});
};
// 1 weekdata e

const calcWeekPnl = (from, to) => {
	const checkDate = (d, f, t) => {
		let itemDate = new Date(d);
		f = new Date(f);
		t = new Date(t);
		let itemDateString = itemDate.toISOString().split('T')[0];
		let fromDate = f.toISOString().split('T')[0];
		let toDate = t.toISOString().split('T')[0];

		// console.log('calcWeekPnl checkDate fromDate');
		// console.log(fromDate);
		// console.log('calcWeekPnl checkDate toDate');
		// console.log(toDate);
		return itemDateString >= fromDate && itemDateString <= toDate;
	};
	let sum = 0;
	let weekData = _dataRev.filter((el) => checkDate(el['Date(UTC)'], from, to));
	let nTrades = 0;
	let winTrades = 0;
	let lossTrades = 0;
	weekData.forEach((el) => {
		let _pnl = parseFloat(el['Realized Profit']);
		if (_pnl !== 0) {
			nTrades++;
			if (_pnl > 0) winTrades++;
			else lossTrades++;
		}
		sum += parseFloat(el['Realized Profit']);
	});
	console.log(`Perpetual customWeek From: ${from}`);
	console.log(`Perpetual customWeek To: ${to}`);
	console.log(`Perpetual customWeek Realized Profit: ${sum}`);

	return { sum, nTrades, winTrades, lossTrades };
};

// 1 customWeekData s
exports.getCustomWeekData = async (req, res) => {
	let params = req.params;
	let from = params.from;
	let to = params.to;
	console.log('getCustomWeekData');
	console.log('from');
	console.log(from);
	console.log('to');
	console.log(to);
	// const data = calcWeekProfit(week);
	// const data = 'getCustomWeekData';
	const data = calcWeekPnl(from, to);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: 'data.length',
		data,
	});
};
// 1 customWeekData e
// 1 monthData s
exports.getMonthData = async (req, res) => {
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
