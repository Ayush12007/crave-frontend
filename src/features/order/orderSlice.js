import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Create Payment Intent
export const createPaymentIntent = createAsyncThunk('order/createIntent', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders/create-payment-intent', payload);
    return data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment Init Failed');
  }
});

// Confirm Order
export const confirmOrder = createAsyncThunk('order/confirm', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders/confirm', orderData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Order Confirmation Failed');
  }
});

// Validate Coupon
export const validateCoupon = createAsyncThunk('order/validateCoupon', async ({ code, cartTotal }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/coupons/validate', { code, cartTotal });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invalid Coupon');
  }
});

// Fetch User History
export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/myorders');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

// Fetch Live Queue (Staff)
export const fetchLiveQueue = createAsyncThunk('order/fetchLiveQueue', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/live-queue');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed');
  }
});

// Update Status (Staff)
export const updateOrderStatus = createAsyncThunk('order/updateStatus', async ({ orderId, status }, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.put(`/orders/${orderId}/status`, { status });
    dispatch(fetchLiveQueue()); 
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

// Fetch Single Order
export const fetchOrderDetails = createAsyncThunk('order/fetchDetails', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    clientSecret: null,
    loading: false,
    error: null,
    success: false,
    coupon: null,
    couponError: null
  },
  reducers: {
    resetOrder: (state) => {
      state.success = false;
      state.currentOrder = null;
      state.clientSecret = null;
      state.error = null;
      state.coupon = null;
      state.couponError = null;
    },
    clearCoupon: (state) => {
      state.coupon = null;
      state.couponError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Intent Logic
      .addCase(createPaymentIntent.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      // Confirm Logic
      .addCase(confirmOrder.pending, (state) => { state.loading = true; })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.clientSecret = null;
      })
      .addCase(confirmOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Coupon Logic
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.coupon = action.payload;
        state.couponError = null;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.coupon = null;
        state.couponError = action.payload;
      })

      // Fetch History
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Live Queue
      .addCase(fetchLiveQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; 
      })

      // Single Order
      .addCase(fetchOrderDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { resetOrder, clearCoupon } = orderSlice.actions;
export default orderSlice.reducer;