import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const buyPointsAdapter = createEntityAdapter({
	selectId: (item) => item.interval,
});

const initialState = buyPointsAdapter.getInitialState({
	status: 'idle',
	error: null,
});

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchBuyPoints = createAsyncThunk('buyPoints/fetchBuyPoints', async () => {
	const response = await axios.get(`${myApi}/buyPoints`);
	let arr = [];
	console.log(response.data.data.buyPoints);
	for (const [interval, data] of Object.entries(response.data.data.buyPoints)) {
		arr.push({ interval, ...data });
	}

	return arr;
});

const buyPointsSlice = createSlice({
	name: 'buyPoints',
	initialState,
	reducers: {
		buyPointAdded: {
			reducer(state, action) {
				state.buyPoints.entities.push(action.payload);
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
		[fetchBuyPoints.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchBuyPoints.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			buyPointsAdapter.upsertMany(state, action.payload);
		},
		[fetchBuyPoints.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const { buyPointAdded } = buyPointsSlice.actions;

export default buyPointsSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll,
	selectById,
	selectIds,
	// Pass in a selector that returns the posts slice of state
} = buyPointsAdapter.getSelectors((state) => state.buyPoints);
