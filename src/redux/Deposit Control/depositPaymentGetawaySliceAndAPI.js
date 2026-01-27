
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseURL } from '../../utils/baseURL';
import { selectToken } from '../auth/authSlice';


export const getDepositPaymentMethods = createAsyncThunk(
  'depositPaymentMethod/getDepositPaymentMethods',
  async (_, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/deposit-payment-method`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch deposit payment methods');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const createDepositPaymentMethod = createAsyncThunk(
  'depositPaymentMethod/create',
  async (data, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/deposit-payment-method`, {
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
        return rejectWithValue(dataResponse.message || 'Error creating deposit payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const getDepositPaymentMethodById = createAsyncThunk(
  'depositPaymentMethod/getById',
  async (id, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/deposit-payment-method/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Error creating deposit payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const updateDepositPaymentMethod = createAsyncThunk(
  'depositPaymentMethod/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/deposit-payment-method/${id}`, {
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
        return rejectWithValue(dataResponse.message || 'Error updating deposit payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const deleteDepositPaymentMethod = createAsyncThunk(
  'depositPaymentMethod/delete',
  async (id, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/deposit-payment-method/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();
      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Error deleting deposit payment method');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
const depositPaymentMethodSlice = createSlice({
  name: 'depositPaymentMethod',
  initialState: {
    depositPaymentMethods: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDepositPaymentMethods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepositPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.depositPaymentMethods = action.payload;
      })
      .addCase(getDepositPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getDepositPaymentMethodById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepositPaymentMethodById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.depositPaymentMethod = action.payload;
      })
      .addCase(getDepositPaymentMethodById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createDepositPaymentMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDepositPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.depositPaymentMethods.push(action.payload);
      })
      .addCase(createDepositPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateDepositPaymentMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDepositPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.depositPaymentMethods = state.depositPaymentMethods.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateDepositPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteDepositPaymentMethod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDepositPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.depositPaymentMethods = state.depositPaymentMethods.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(deleteDepositPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { depositPaymentMethods, isLoading, error } = depositPaymentMethodSlice.actions;

export default depositPaymentMethodSlice.reducer;

