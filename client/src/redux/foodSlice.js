import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  foodList: [],
  isLoading: false,
  error: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    fetchFoodListStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchFoodListSuccess(state, action) {
      state.isLoading = false;
      state.foodList = action.payload;
    },
    fetchFoodListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchFoodListStart, fetchFoodListSuccess, fetchFoodListFailure } = foodSlice.actions;

export const fetchFoodList = () => async (dispatch) => {
  dispatch(fetchFoodListStart());
  try {
    const response = await axios.get(`${process.env.REACT_APP_URL}/food/list`);
    dispatch(fetchFoodListSuccess(response.data.data));
  } catch (err) {
    console.error('Failed to fetch food list:', err);
    dispatch(fetchFoodListFailure(err.message));
  }
};

export default foodSlice.reducer;