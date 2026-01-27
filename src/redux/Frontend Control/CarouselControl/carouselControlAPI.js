import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectToken } from "../../auth/authSlice";
import { baseURL } from "../../../utils/baseURL";

export const getCarouselImages = createAsyncThunk(
  'carouselControl/getCarouselImages',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await fetch(`${baseURL}/homeCarousel`, {
        method: 'GET',
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
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateCarouselImages = createAsyncThunk(
  'carouselControl/updateCarouselImages',
  async ({ id, images, isActive, interval, infiniteLoop, autoPlay }, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await fetch(`${baseURL}/homeCarousel/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ images, isActive, interval, infiniteLoop, autoPlay }),
      });

      const dataResponse = await response.json();
      
      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to update carousel');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);