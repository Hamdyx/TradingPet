const express = require('express');

const {
	checkBinanceConnectivity,
	getAllData,
	getMovingAverages,
	movingAverageByInterval,
	getWeightedMa,
	getWeightedMaByInterval,
	getBollingerBands,
	getBollingerBandsByInterval,
	getAverageHighs,
	getHighsByInterval,
	getAverageLows,
	getLowsByInterval,
	getAverageSupport,
	getSupportByInterval,
	getAverageResistance,
	getResistanceByInterval,
	getAverageBuyPoints,
	getBuyPointsByInterval,
	getAverageSellPoints,
	getSellPointsByInterval,
} = require('../controllers/binanceController');

const router = express.Router();

// router.param('id', checkId);
router.route('/').get(getAllData);

router.route('/movingAverages').get(getMovingAverages);
router.route('/movingAverages/:interval').get(movingAverageByInterval);

router.route('/weightedMovingAverages').get(getWeightedMa);
router.route('/weightedMovingAverages/:interval').get(getWeightedMaByInterval);

router.route('/bollingerBands').get(getBollingerBands);
router.route('/bollingerBands/:interval').get(getBollingerBandsByInterval);

router.route('/highs').get(getAverageHighs);
router.route('/highs/:interval').get(getHighsByInterval);

router.route('/lows').get(getAverageLows);
router.route('/lows/:interval').get(getLowsByInterval);

router.route('/support').get(getAverageSupport);
router.route('/support/:interval').get(getSupportByInterval);

router.route('/resistance').get(getAverageResistance);
router.route('/resistance/:interval').get(getResistanceByInterval);

router.route('/buyPoints').get(getAverageBuyPoints);
router.route('/buyPoints/:interval').get(getBuyPointsByInterval);

router.route('/sellPoints').get(getAverageSellPoints);
router.route('/sellPoints/:interval').get(getSellPointsByInterval);

// router.route('/').get(getAllData).post(checkBody, createData);
// router.route('/:id').get(getData).patch(updateData).delete(deleteTask);

module.exports = router;
