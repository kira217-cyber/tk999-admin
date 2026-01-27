import { createSlice } from "@reduxjs/toolkit";
import { getAllCustomer, getUserInfo, updateUserInfo } from "./userFrontendAPI";

const userFrontendSlice = createSlice({
  name: "userFrontend",
  initialState: {
    customerInfo: null,
    isLoading: false,
    isError: false,
    errorMessage: '',
    userInfo: null,
    userLoading: false,
    userError: false,
    userErrorMessage: '',
    userProfileUpdateLoading: false,
    userProfileUpdateError: false,
    userProfileUpdateErrorMessage: '',
  },
  reducers: {
    getCustomerInfoStart: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.customerInfo = null;
    },
    getUserStart: (state) => {
      state.userLoading = true;
      state.userError = false;
      state.userErrorMessage = '';
    },
    updateUserStart: (state) => {
      state.userProfileUpdateLoading = true;
      state.userProfileUpdateError = false;
      state.userProfileUpdateErrorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCustomer.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.customerInfo = null;
    });
    builder.addCase(getAllCustomer.fulfilled, (state, action) => {
      state.isLoading = false;
      state.customerInfo = action.payload;
    });
    builder.addCase(getAllCustomer.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(getUserInfo.pending, (state) => {
      state.userLoading = true;
      state.userError = false;
      state.userErrorMessage = '';
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userLoading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.userLoading = false;
      state.userError = true;
      state.userErrorMessage = action.payload;
    });
    builder.addCase(updateUserInfo.pending, (state) => {
      state.userProfileUpdateLoading = true;
      state.userProfileUpdateError = false;
      state.userProfileUpdateErrorMessage = '';
    });
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      state.userProfileUpdateLoading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(updateUserInfo.rejected, (state, action) => {
      state.userProfileUpdateLoading = false;
      state.userProfileUpdateError = true;
      state.userProfileUpdateErrorMessage = action.payload;
    });
  },
});

export default userFrontendSlice.reducer;

