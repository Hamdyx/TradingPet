import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const sellPointsAdapter = createEntityAdapter({
	selectId: (item) => item.interval,
});

const initialState = sellPointsAdapter.getInitialState({
	status: 'idle',
	error: null,
});

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchSellPoints = createAsyncThunk(
	'sellPoints/fetchSellPoints',
	async () => {
		const response = await axios.get(`${myApi}/sellPoints`);
		let arr = [];
		console.log(response.data.data.sellPoints);
		for (const [interval, data] of Object.entries(response.data.data.sellPoints)) {
			arr.push({ interval, ...data });
		}

		return arr;
	}
);

const sellPointsSlice = createSlice({
	name: 'sellPoints',
	initialState,
	reducers: {
		sellPointAdded: {
			reducer(state, action) {
				state.sellPoints.entities.push(action.payload);
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
		[fetchSellPoints.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchSellPoints.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			sellPointsAdapter.upsertMany(state, action.payload);
		},
		[fetchSellPoints.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const { sellPointAdded } = sellPointsSlice.actions;

export default sellPointsSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll,
	selectById,
	selectIds,
	// Pass in a selector that returns the posts slice of state
} = sellPointsAdapter.getSelectors((state) => state.sellPoints);
