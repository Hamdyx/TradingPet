import {
	createSlice,
	nanoid,
	createAsyncThunk,
	createSelector,
	createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');

const resistanceAdapter = createEntityAdapter({
	// selectId: (task) => task.taskId,
});

const initialState = resistanceAdapter.getInitialState({
	status: 'idle',
	error: null,
});

// const myApi = 'http://127.0.0.1:5000/api/v1/binance/movingAverages';
const myApi = 'http://127.0.0.1:5000/api/v1/binance';

export const fetchResistance = createAsyncThunk(
	'resistanceAverage/fetchResistance',
	async () => {
		const response = await axios.get(`${myApi}/resistance`);
		let data = response.data.data.averageResistance;
		let arr = [];
		for (const [interval, data] of Object.entries(response.data.data.averageResistance)) {
			arr.push({ id: interval, data });
		}

		return arr;
	}
);

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

const resistanceSlice = createSlice({
	name: 'resistanceAverage',
	initialState,
	reducers: {
		resistanceAdded: {
			reducer(state, action) {
				state.resistance.entities.push(action.payload);
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
		[fetchResistance.pending]: (state, action) => {
			state.status = 'loading';
		},
		[fetchResistance.fulfilled]: (state, action) => {
			state.status = 'succeeded';

			resistanceAdapter.upsertMany(state, action.payload);
		},
		[fetchResistance.rejected]: (state, action) => {
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

export const { resistanceAdded } = resistanceSlice.actions;

export default resistanceSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllResistance,
	selectById: selectResistanceById,
	selectIds: selectResistanceIds,
	// Pass in a selector that returns the posts slice of state
} = resistanceAdapter.getSelectors((state) => state.resistance);
