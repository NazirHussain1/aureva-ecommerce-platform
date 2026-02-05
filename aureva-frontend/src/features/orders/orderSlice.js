import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await orderApi.getOrders();
  return response.data;
});

export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData) => {
  const response = await orderApi.placeOrder(orderData);
  return response.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
