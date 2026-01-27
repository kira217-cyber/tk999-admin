import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { selectToken } from '../auth/authSlice';
import { baseURL } from '../../utils/baseURL';


export const fetchPromotions = createAsyncThunk(
  'promotionControl/fetchPromotions',
  async (_, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/promotion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataResponse = await response.json();

      if (response.ok) {

        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch carousel');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const createPromotion = createAsyncThunk(
  'promotionControl/createPromotion',
  async (data, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/promotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const createdPromotion = await response.json();
      if (response.ok) {
        return createdPromotion.data;
      } else {
        return rejectWithValue(createdPromotion.error || 'Error creating promotion');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const updatePromotion = createAsyncThunk(
  'promotionControl/updatePromotion',
  async ({ id, data }, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/promotion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const updatedPromotion = await response.json();
      if (response.ok) {
        return updatedPromotion.data;
      } else {
        return rejectWithValue(updatedPromotion.error || 'Error updating promotion');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const deletePromotion = createAsyncThunk(
  'promotionControl/deletePromotion',
  async (id, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await fetch(`${baseURL}/promotion/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const deletedPromotion = await response.json();
      if (response.ok) {
        return deletedPromotion.data;
      } else {
        return rejectWithValue(deletedPromotion.error || 'Error deleting promotion');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const promotionControlSlice = createSlice({
  name: 'promotionControl',
  initialState: {
    promotions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {

        state.promotions = action.payload;
        state.loading = false;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.promotions.push(action.payload);
        state.loading = false;
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        const index = state.promotions.findIndex((item) => item._id === action.payload._id);
        state.promotions[index] = action.payload;
        state.loading = false;
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.promotions = state.promotions.filter((item) => item._id !== action.payload._id);
        state.loading = false;
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default promotionControlSlice.reducer;

