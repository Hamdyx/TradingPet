import { configureStore } from '@reduxjs/toolkit';

import maReducer from '../features/movingAverage/maSlice';
import wmaReducer from '../features/weightedMovingAverage/wmaSlice';
import bbReducer from '../features/bollingerBands/bbSlice';

/* import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'; */

export const store = configureStore(
	{
		reducer: {
			ma: maReducer,
			wma: wmaReducer,
			bb: bbReducer,
		},
	},
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	/* composeWithDevTools(applyMiddleware(...middleware)) */
);
