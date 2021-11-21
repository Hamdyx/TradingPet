import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createSelector,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const lowsAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = lowsAdapter.getInitialState({
	status: 'idle',
	error: null,
});

// const myApi = 'http://127.0.0.1:5000/api/v1/binance/movingAverages';
const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchLows = createAsyncThunk('lowsAverage/fetchLows', async () => {
	const response = await axios.get(`${myApi}/lows`);
	let data = response.data.data.averageLows;
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.averageLows)) {
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

const lowsSlice = createSlice({
	name: 'lowsAverage',
	initialState,
	reducers: {
		lowAdded: {
			reducer(state, action) {
				state.highs.entities.push(action.payload);
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
		[fetchLows.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchLows.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			lowsAdapter.upsertMany(state, action.payload);
		},
		[fetchLows.rejected]: (state, action) => {
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

export const { lowAdded } = lowsSlice.actions;

export default lowsSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllLows,
	selectById: selectLowById,
	selectIds: selectLowsIds,
	// Pass in a selector that returns the posts slice of state
} = lowsAdapter.getSelectors((state) => state.lows);
