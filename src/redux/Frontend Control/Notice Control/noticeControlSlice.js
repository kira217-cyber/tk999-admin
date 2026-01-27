import { createSlice } from "@reduxjs/toolkit";
import { getAllNotices, updateNotice } from "./noticeControlAPI";
const noticeControlSlice = createSlice({
  name: "noticeControl",
  initialState: {
    _id: "",
    title: "",
    titleBD: "",
    emoji: "",
    active: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    resetNoticeControlState: (state) => {
      state._id = "";
      state.title = "";
      state.titleBD = "";
      state.emoji = "";
      state.active = true;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state._id = action.payload?._id;
        state.title = action.payload?.title;
        state.titleBD = action.payload?.titleBD;
        state.emoji = action.payload?.emoji;
        state.active = action.payload?.active;

      })
      .addCase(getAllNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      })
      .addCase(updateNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state._id = action.payload?._id;
        state.title = action.payload?.title;
        state.titleBD = action.payload?.titleBD;
        state.emoji = action.payload?.emoji;
        state.active = action.payload?.active;
      })
      .addCase(updateNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export default noticeControlSlice.reducer;

