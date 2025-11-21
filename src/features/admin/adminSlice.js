import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAnalytics = createAsyncThunk('admin/analytics', async () => (await api.get('/admin/analytics')).data);
export const fetchUsers = createAsyncThunk('admin/users', async () => (await api.get('/admin/users')).data);
export const updateCommission = createAsyncThunk('admin/commission', async (rate) => (await api.post('/admin/commission', { rate })).data);
export const fetchTickets = createAsyncThunk('admin/tickets', async () => (await api.get('/admin/tickets')).data);

const adminSlice = createSlice({
  name: 'admin',
  initialState: { analytics: null, users: [], tickets: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.analytics = action.payload; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(fetchTickets.fulfilled, (state, action) => { state.tickets = action.payload; });
  }
});
export default adminSlice.reducer;