import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/menu');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load menu');
  }
});

export const addMenuItem = createAsyncThunk('menu/add', async (itemData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/menu', itemData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item');
  }
});

// [NEW] Create Review Thunk
export const createReview = createAsyncThunk('menu/createReview', async ({ id, rating, comment }, { rejectWithValue }) => {
  try {
    await api.post(`/menu/${id}/reviews`, { rating, comment });
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add review');
  }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => { state.loading = true; })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
      // Note: We usually reload the menu after a review, so no extra state handling needed here
  }
});

export default menuSlice.reducer;