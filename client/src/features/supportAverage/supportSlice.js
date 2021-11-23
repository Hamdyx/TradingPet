import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createSelector,
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

// const myApi = 'http://127.0.0.1:5000/api/v1/binance/movingAverages';
const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchSupport = createAsyncThunk('supportAverage/fetchSupport', async () => {
	const response = await axios.get(`${myApi}/support`);
	let data = response.data.data.averageSupport;
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.averageSupport)) {
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

export const { supportAdded } = supportSlice.actions;

export default supportSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllSupport,
	selectById: selectSupportById,
	selectIds: selectSupportIds,
	// Pass in a selector that returns the posts slice of state
} = supportAdapter.getSelectors((state) => state.support);
