import {
	createSlice,
	nanoid,
	createAsyncThunk,
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

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchLows = createAsyncThunk('lowsAverage/fetchLows', async () => {
	const response = await axios.get(`${myApi}/lows`);
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.averageLows)) {
		arr.push({ id: interval, ...data });
	}

	return arr;
});

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
