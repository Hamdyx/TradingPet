const express = require('express');

const { getDataByInterval, getAllData } = require('../controllers/binanceDataController');

const router = express.Router();

// router.param('id', checkId);
router.route('/').get(getAllData);
router.route('/:symbol/:interval').get(getDataByInterval);

/* router.route('/sma').get(getSma);
router.route('/sma/:period').get(getSma);

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
 */
module.exports = router;
