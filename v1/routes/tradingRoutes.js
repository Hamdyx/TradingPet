const express = require('express');

const {
	getAllData,
	getDayData,
	getMonthData,
	getApiReq,
	getWeekData,
	getCustomWeekData,
} = require('../controllers/tradingHistory/perpetualController');
const {
	getFuturesDay,
	getFuturesWeek,
	getFuturesMonth,
} = require('../controllers/tradingHistory/futuresController');

const router = express.Router();

// router.param('id', checkId);

router.route('/').get(getAllData);
router.route('/day').get(getDayData);
router.route('/day/:date').get(getDayData);
router.route('/perpetual/week').get(getWeekData);
router.route('/perpetual/week/:from/:to').get(getCustomWeekData);
router.route('/futures/day').get(getFuturesDay);
router.route('/futures/day/:date').get(getFuturesDay);
router.route('/month').get(getMonthData);
router.route('/futures/week').get(getFuturesWeek);
router.route('/futures/month').get(getFuturesMonth);
router.route('/futures/month/:date').get(getFuturesMonth);
router.route('/month/:date').get(getMonthData);
router.route('/api').get(getApiReq);

module.exports = router;
