import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isError: false,
  errorMessage: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.user = action.payload; // <-- user data here
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    checkTokenStart: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    checkTokenSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    checkTokenFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  checkTokenStart,
  checkTokenSuccess,
  checkTokenFailure,
} = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export default authSlice.reducer;
