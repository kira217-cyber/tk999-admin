import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectToken } from "../../auth/authSlice";
import { baseURL } from "../../../utils/baseURL";

export const updateNotice = createAsyncThunk(
  'noticeControl/updateNotice',
  async ({ title, titleBD, emoji, active }, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await fetch(`${baseURL}/notice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, titleBD, emoji, active }),
      });

      const dataResponse = await response.json();

      console.log("this is redux -> ", dataResponse);

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to update notice');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const getAllNotices = createAsyncThunk(
  'noticeControl/getAllNotices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await fetch(`${baseURL}/notice`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse?.data[0];
      } else {
        return rejectWithValue(dataResponse.message || 'Failed to fetch notices');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
