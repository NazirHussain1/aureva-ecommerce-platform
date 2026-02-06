import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAdminData = createAsyncThunk(
  'admin/fetchAdminData',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/admin/data');
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products: [],
    orders: [],
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.orders = action.payload.orders;
        state.customers = action.payload.customers;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { addProduct, removeProduct, clearError } = adminSlice.actions;

export default adminSlice.reducer;
