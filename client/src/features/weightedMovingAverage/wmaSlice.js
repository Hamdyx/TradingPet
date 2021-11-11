import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createSelector,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const wmaAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = wmaAdapter.getInitialState({
	status: 'idle',
	error: null,
});

// const myApi = 'http://127.0.0.1:5000/api/v1/binance/movingAverages';
const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchWmA = createAsyncThunk('weightedMovingAverage/fetchWmA', async () => {
	const response = await axios.get(`${myApi}/weightedMovingAverages`);
	let data = response.data.data.wma;
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.wma)) {
		arr.push({ id: interval, data });
	}

	return arr;
});

/* 
export const addNewMA = createAsyncThunk('ma/addNewMA', async (initialMA) => {
	const response = await axios.post(myApi, initialMA);

	return response.data.task;
});

export const maUpdated = createAsyncThunk('ma/maUpdated', async (initialMA) => {
	const response = await axios.patch(`${myApi}/${initialMA.id}`, initialMA);

	return response.data.data.task;
}); 
*/

const wmaSlice = createSlice({
	name: 'weightedMovingAverage',
	initialState,
	reducers: {
		wmaAdded: {
			reducer(state, action) {
				state.wma.entities.push(action.payload);
				// tasksAdapter.addOne;
			},
			prepare(title, content) {
				return {
					payload: {
						id: nanoid(),
						date: new Date().toISOString(),
						title,
						content,
					},
				};
			},
		},
	},
	extraReducers: {
		[fetchWmA.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchWmA.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			wmaAdapter.upsertMany(state, action.payload);
		},
		[fetchWmA.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
		// Use the `addOne` reducer for the fulfilled case
		/* [addNewMA.fulfilled]: maAdapter.addOne,
		[maUpdated.pending]: (state, action) => {
			state.status = 'loading';
		},
		[maUpdated.rejected]: (state, action) => {
			state.status = 'fail';
			state.error = action.error.message;
		},
		[maUpdated.fulfilled]: (state, action) => {
			state.status = 'succeeded';
			maAdapter.upsertOne(state, action.payload);
		}, */
	},
});

export const { maAdded } = wmaSlice.actions;

export default wmaSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllWMA,
	selectById: selectWmaById,
	selectIds: selectWmaIds,
	// Pass in a selector that returns the posts slice of state
} = wmaAdapter.getSelectors((state) => state.wma);
