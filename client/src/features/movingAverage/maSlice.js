import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createSelector,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const maAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = maAdapter.getInitialState({
	status: 'idle',
	error: null,
});

// const myApi = 'http://127.0.0.1:5000/api/v1/binance/movingAverages';
const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchMA = createAsyncThunk('movingAverages/fetchMA', async () => {
	const response = await axios.get(`${myApi}/movingAverages`);
	let data = response.data.data.ma;
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.ma)) {
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

const maSlice = createSlice({
	name: 'movingAverage',
	initialState,
	reducers: {
		maAdded: {
			reducer(state, action) {
				state.tasks.entities.push(action.payload);
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
		[fetchMA.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchMA.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			maAdapter.upsertMany(state, action.payload);
		},
		[fetchMA.rejected]: (state, action) => {
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

export const { maAdded } = maSlice.actions;

export default maSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllMA,
	selectById: selectMaById,
	selectIds: selectMaIds,
	// Pass in a selector that returns the posts slice of state
} = maAdapter.getSelectors((state) => state.ma);
