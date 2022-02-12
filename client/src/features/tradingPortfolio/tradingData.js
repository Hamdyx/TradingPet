const axios = require('axios');

exports.getDayData = async (d) => {
	d = new Date(parseInt(d));
	d = d.toISOString().split('T')[0];
	/* const data = await axios.get(`http://localhost:8000/api/v1/tradex/day/2022-01-12`); */
	const data = await axios.get(`http://localhost:5000/api/v1/trading/day/${d}`);
	console.log(data.data);
	return data.data.data;
};
exports.getWeekData = async (d) => {
	const data = await axios.get(`http://localhost:5000/api/v1/trading/perpetual/week`);
	console.log(data.data);
	return data.data.data;
};
exports.getMonthData = async (d) => {
	const data = await axios.get(`http://localhost:5000/api/v1/trading/month/0`);
	console.log(data.data);
	return data.data.data;
};
exports.getFuturesDay = async (d) => {
	/* const data = await axios.get(`http://localhost:5000/api/v1/trading/day/2022-01-12`); */
	const data = await axios.get(`http://localhost:5000/api/v1/trading/futures/day/${d}/`);
	console.log(data.data);
	return data.data.data;
};
exports.getFuturesWeek = async (d) => {
	const data = await axios.get(`http://localhost:5000/api/v1/trading/futures/week`);
	console.log(data.data);
	return data.data.data;
};
exports.getFuturesMonth = async (d) => {
	const data = await axios.get(`http://localhost:5000/api/v1/trading/futures/month/0`);
	console.log(data.data);
	return data.data.data;
};
