import axios from "axios";
import { baseURL } from "../../../utils/baseURL";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectToken } from "../../auth/authSlice";

export const fetchGames = createAsyncThunk(
  'game/fetchGames',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.get(`${baseURL}/game`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error fetching games');
    }
  }
);

export const createGame = createAsyncThunk(
  'game/createGame',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.post(`${baseURL}/game`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error creating game');
    }
  }
);

export const updateGame = createAsyncThunk(
  'game/updateGame',
  async ({ id, data }, { getState, rejectWithValue }) => {


    try {
      const token = selectToken(getState());
      const response = await axios.put(`${baseURL}/game/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error updating game');
    }
  }
);

export const deleteGame = createAsyncThunk(
  'game/deleteGame',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      await axios.delete(`${baseURL}/game/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error deleting game');
    }
  }
);

