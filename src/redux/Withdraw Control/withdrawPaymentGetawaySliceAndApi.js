import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseURL } from '../../utils/baseURL';
import { selectToken } from '../auth/authSlice';

export const getWithdrawPaymentMethods = createAsyncThunk(
  'withdrawPaymentMethod/getWithdrawPaymentMethods',
  async (_, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-method`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch withdraw payment methods');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const createWithdrawPaymentMethod = createAsyncThunk(
  'withdrawPaymentMethod/create',
  async (data, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Error creating withdraw payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const getWithdrawPaymentMethodById = createAsyncThunk(
  'withdrawPaymentMethod/getById',
  async (id, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-method/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Error fetching withdraw payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const updateWithdrawPaymentMethod = createAsyncThunk(
  'withdrawPaymentMethod/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-method/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const dataResponse = await response.json();
      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Error updating withdraw payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const deleteWithdrawPaymentMethod = createAsyncThunk(
  'withdrawPaymentMethod/delete',
  async (id, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/withdraw-payment-method/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();
      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Error deleting withdraw payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const withdrawPaymentMethodSlice = createSlice({
  name: 'withdrawPaymentMethod',
  initialState: {
    withdrawPaymentMethods: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWithdrawPaymentMethods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWithdrawPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawPaymentMethods = action.payload;
      })
      .addCase(getWithdrawPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getWithdrawPaymentMethodById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWithdrawPaymentMethodById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawPaymentMethod = action.payload;
      })
      .addCase(getWithdrawPaymentMethodById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createWithdrawPaymentMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWithdrawPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawPaymentMethods.push(action.payload);
      })
      .addCase(createWithdrawPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateWithdrawPaymentMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWithdrawPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawPaymentMethods = state.withdrawPaymentMethods.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateWithdrawPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteWithdrawPaymentMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWithdrawPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawPaymentMethods = state.withdrawPaymentMethods.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(deleteWithdrawPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { withdrawPaymentMethods, isLoading, error } = withdrawPaymentMethodSlice.actions;

export default withdrawPaymentMethodSlice.reducer;