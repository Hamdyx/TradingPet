import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import {
	getDayData,
	getWeekData,
	getMonthData,
	getFuturesDay,
	getFuturesWeek,
	getFuturesMonth,
} from './tradingData';

import './TradingPortfolio.css';

const TradingPorfolio = ({ interval, selector }) => {
	const [dayPnl, setDayPnl] = useState(0);
	const [yesterdayPnl, setYesterdayPnl] = useState(0);
	const [weekPnl, setWeekPnl] = useState(0);
	const [monthPnl, setMonthPnl] = useState(0);
	const [futuresDayPnl, setFuturesDayPnl] = useState(0);
	const [futuresWeekPnl, setFuturesWeekPnl] = useState(0);
	const [futuresYesterdayPnl, setFuturesYesterdayPnl] = useState(0);
	const [futuresMonthPnl, setFuturesMonthPnl] = useState(0);
	let today = new Date();
	let yesterday = new Date(today);

	const setDayData = async () => {
		/* today = new Date(today.toLocaleDateString());
		today.setHours(2); */

		yesterday.setDate(yesterday.getDate() - 1);
		let dayTest = 0;
		let futuresDayTest = 0;

		let yesterdayTest = 0;
		let futuresYesterdayTest = 0;
		dayTest = await getDayData(today.getTime());
		futuresDayTest = await getFuturesDay(today.getTime());

		yesterdayTest = await getDayData(yesterday.getTime());
		futuresYesterdayTest = await getFuturesDay(yesterday.getTime());
		setDayPnl(dayTest['sum']);
		setFuturesDayPnl(futuresDayTest);

		setYesterdayPnl(yesterdayTest);
		setFuturesYesterdayPnl(futuresYesterdayTest);
	};

	const setMonthData = async () => {
		let _week = 0;
		let _month = 0;
		let futuresMonthTest = 0;
		let futuresWeekTest = 0;
		_week = await getWeekData();
		_month = await getMonthData();
		futuresMonthTest = await getFuturesMonth();
		futuresWeekTest = await getFuturesWeek();
		setWeekPnl(_week);
		setMonthPnl(_month);
		setFuturesWeekPnl(futuresWeekTest);
		setFuturesMonthPnl(futuresMonthTest);
	};
	useEffect(() => {
		setDayData();
		setMonthData();
	}, []);

	return (
		<Container>
			<h4>Perpetual</h4>
			<Row>
				<Col xs={3}>
					<DayData />
				</Col>
				<Col xs={3}>
					<p>Today</p>
					<p>PNL: ${dayPnl.toFixed(2)}</p>
					<p>Target: {((dayPnl / 10) * 100).toFixed(2)}%</p>
				</Col>
				<Col xs={3}>
					<p>Week</p>
					<p>PNL: ${weekPnl.toFixed(2)}</p>
					<p>Target: {((weekPnl / 40) * 100).toFixed(2)}%</p>
				</Col>
				<Col xs={3}>
					<p>Month</p>
					<p>PNL: ${monthPnl.toFixed(2)}</p>
					<p>Target: {((monthPnl / 175) * 100).toFixed(2)}%</p>
				</Col>
			</Row>
			<h4>Futures</h4>
			<Row>
				<Col xs={3}>
					<p>Yesterday</p>
					<p>PNL: ${futuresYesterdayPnl.toFixed(2)}</p>
					<p>Target: {((futuresYesterdayPnl / 10) * 100).toFixed(2)}%</p>
				</Col>
				<Col xs={3}>
					<p>Today</p>
					<p>PNL: ${futuresDayPnl.toFixed(2)}</p>
					<p>Target: {((futuresDayPnl / 10) * 100).toFixed(2)}%</p>
				</Col>
				<Col xs={3}>
					<p>Week</p>
					<p>PNL: ${futuresWeekPnl.toFixed(2)}</p>
					<p>Target: {((futuresWeekPnl / 40) * 100).toFixed(2)}%</p>
				</Col>
				<Col xs={3}>
					<p>Month</p>
					<p>PNL: ${futuresMonthPnl.toFixed(2)}</p>
					<p>Target: {((futuresMonthPnl / 175) * 100).toFixed(2)}%</p>
				</Col>
			</Row>
		</Container>
	);
};

const DayData = () => {
	const [day, setDay] = useState(new Date());
	const [pnl, setPnl] = useState(0);
	const [trades, setTrades] = useState(0);
	const [win, setWin] = useState(0);
	const [loss, setLoss] = useState(0);

	useEffect(() => {
		const dayInput = document.querySelector('.day_input');
		console.log(dayInput);
		dayInput.addEventListener('change', (ev) => {
			// console.log('ev.target.value');
			// console.log(ev.target.value);
			setDay(new Date(ev.target.value));
		});
	}, []);

	useEffect(() => {
		const updatePnl = async () => {
			let data = await getDayData(day.getTime());
			console.log(data);
			console.log(`data['sum']`);
			console.log(data['sum']);
			setPnl(data['sum']);
			setTrades(data['nTrades']);
			setWin(data['winTrades']);
			setLoss(data['lossTrades']);
		};

		updatePnl();
	}, [day]);

	const formatDateToInput = (date) => {
		return date.toISOString().split('T')[0];
	};
	return (
		<Container className="tradingCard">
			<Row>
				<Col>
					<h4>Day</h4>
				</Col>
				<Col>
					<Form.Control
						type="date"
						className="day_input"
						defaultValue={formatDateToInput(day)}
					/>
				</Col>
			</Row>

			<Row className="mt-2">
				<Col className="text-left">
					<p>PNL: ${pnl.toFixed(2)}</p>
				</Col>
				<Col className="text-right">
					<p>{((pnl / 10) * 100).toFixed(2)}%</p>
				</Col>
			</Row>
			<Row>
				<Col className="text-left">
					<p>Trades: {trades}</p>
				</Col>
			</Row>
			<Row>
				<Col className="text-left">
					<p>Win: {win}</p>
				</Col>
				<Col className="text-right">
					<p>Lose: {loss}</p>
				</Col>
			</Row>
		</Container>
	);
};

export default TradingPorfolio;
