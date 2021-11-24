import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const highsAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = highsAdapter.getInitialState({
	status: 'idle',
	error: null,
});

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchHighs = createAsyncThunk('highsAverage/fetchHighs', async () => {
	const response = await axios.get(`${myApi}/highs`);
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.averageHighs)) {
		arr.push({ id: interval, ...data });
	}

	return arr;
});

const highsSlice = createSlice({
	name: 'highsAverage',
	initialState,
	reducers: {
		highAdded: {
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
		[fetchHighs.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchHighs.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			highsAdapter.upsertMany(state, action.payload);
		},
		[fetchHighs.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const { highAdded } = highsSlice.actions;

export default highsSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllHighs,
	selectById: selectHighById,
	selectIds: selectHighsIds,
	// Pass in a selector that returns the posts slice of state
} = highsAdapter.getSelectors((state) => state.highs);
