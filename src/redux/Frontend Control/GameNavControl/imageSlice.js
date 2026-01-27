import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL_For_IMG_UPLOAD } from '../../../utils/baseURL';


// Thunk for image upload
export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async (file, { rejectWithValue }) => {
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      const response = await axios.post(baseURL_For_IMG_UPLOAD, uploadData);
      return response.data.imageUrl;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Image upload failed');
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default imageSlice.reducer;