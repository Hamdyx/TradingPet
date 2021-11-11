import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createSelector,
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

// const myApi = 'http://127.0.0.1:5000/api/v1/binance/movingAverages';
const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchBB = createAsyncThunk('bollingerBands/fetchBB', async () => {
	const response = await axios.get(`${myApi}/bollingerBands`);
	let data = response.data.data.bb;
	console.log('response.data.data.bb');
	console.log(response.data.data.bb);
	let arr = [];
	for (const [interval, data] of Object.entries(response.data.data.bb)) {
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

export const { bbAdded } = bbSlice.actions;

export default bbSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllBB,
	selectById: selectBbById,
	selectIds: selectBbIds,
	// Pass in a selector that returns the posts slice of state
} = bbAdapter.getSelectors((state) => state.bb);
