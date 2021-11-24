import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const supportAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = supportAdapter.getInitialState({
	status: 'idle',
	error: null,
});

const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchSupport = createAsyncThunk('supportAverage/fetchSupport', async () => {
	const response = await axios.get(`${myApi}/support`);
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.averageSupport)) {
		arr.push({ id: interval, ...data });
	}

	return arr;
});

const supportSlice = createSlice({
	name: 'supportAverage',
	initialState,
	reducers: {
		supportAdded: {
			reducer(state, action) {
				state.support.entities.push(action.payload);
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
		[fetchSupport.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchSupport.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			supportAdapter.upsertMany(state, action.payload);
		},
		[fetchSupport.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const { supportAdded } = supportSlice.actions;

export default supportSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllSupport,
	selectById: selectSupportById,
	selectIds: selectSupportIds,
	// Pass in a selector that returns the posts slice of state
} = supportAdapter.getSelectors((state) => state.support);
