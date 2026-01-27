import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseURL } from './../../utils/baseURL';
import { selectToken } from './../auth/authSlice';


export const getAllCustomer = createAsyncThunk(
  'userFrontend/getAllCustomer',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());

      const response = await fetch(`${baseURL}/all-user-customer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();


      if (response.ok) {

        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getUserInfo = createAsyncThunk(
  'userFrontend/getOneUser',
  async (userId, { getState, rejectWithValue }) => {
    try {

      const token = selectToken(getState());

      const response = await fetch(`${baseURL}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const updateUserInfo = createAsyncThunk(
  'userFrontend/updateOneUser',
  async ({userId,updateData}, { getState, rejectWithValue }) => {
    try {

      const token = selectToken(getState());


      const response = await fetch(`${baseURL}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const dataResponse = await response.json();

      if (response.ok) {
        return dataResponse.data;
      } else {
        return rejectWithValue(dataResponse.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
