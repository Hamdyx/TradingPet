import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const bbAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = bbAdapter.getInitialState({
	status: 'idle',
	error: null,
});

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchBB = createAsyncThunk('bollingerBands/fetchBB', async () => {
	const response = await axios.get(`${myApi}/bollingerBands`);
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.bb)) {
		arr.push({ id: interval, ...data });
	}

	return arr;
});

const bbSlice = createSlice({
	name: 'bollingerBands',
	initialState,
	reducers: {
		maAdded: {
			reducer(state, action) {
				state.bb.entities.push(action.payload);
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
		[fetchBB.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchBB.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			bbAdapter.upsertMany(state, action.payload);
		},
		[fetchBB.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const { bbAdded } = bbSlice.actions;

export default bbSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllBB,
	selectById: selectBbById,
	selectIds: selectBbIds,
	// Pass in a selector that returns the posts slice of state
} = bbAdapter.getSelectors((state) => state.bb);
