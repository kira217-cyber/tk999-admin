import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { selectToken } from '../../auth/authSlice';
import { baseURL } from '../../../utils/baseURL';



// Thunks
export const fetchNavbar = createAsyncThunk(
  'navbar/fetchNavbar',
  async (_, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await axios.get(`${baseURL}/navbar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data[0] || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error fetching navbar');
    }
  }
);
export const createNavbar = createAsyncThunk(
  'navbar/createNavbar',
  async (data, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await axios.post(`${baseURL}/navbar`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error creating navbar');
    }
  }
);

export const updateNavbar = createAsyncThunk(
  'navbar/updateNavbar',
  async (data, { getState, rejectWithValue }) => {
    const token = selectToken(getState());
    try {
      const response = await axios.put(`${baseURL}/navbar`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error updating navbar');
    }
  }
);

const navbarSlice = createSlice({
  name: 'navbar',
  initialState: {
    navbar: null,
    demo: "this is demo",
    form: {
      gameBoxMarginTop: '',
      gameNavMenuMarginBottom: '',
      navbarBackgroundColor: '',
      headerMarginBottom: '',
      headerMenuBgColor: '',
      headerMenuBgHoverColor: '',
      fontSize: '',
    },
    editing: false,
    loading: false,
    error: null,
  },
  reducers: {
    setForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    setEditing: (state, action) => {
      state.editing = action.payload;
    },
    resetForm: (state) => {
      state.form = {
        gameBoxMarginTop: '',
        gameNavMenuMarginBottom: '',
        navbarBackgroundColor: '',
        headerMarginBottom: '',
        headerMenuBgColor: '',
        headerMenuBgHoverColor: '',
        fontSize: '',
      };
      state.editing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavbar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNavbar.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.navbar = action.payload;
          state.form = action.payload;
          state.editing = false;
        } else {
          state.loading = false;
          state.error = 'No navbar data found';
        }
      })
      .addCase(fetchNavbar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNavbar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNavbar.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.navbar = action.payload;
          state.form = action.payload;
        } else {
          state.loading = false;
          state.error = 'Failed to create navbar';
        }
      })
      .addCase(createNavbar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNavbar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNavbar.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.navbar = action.payload;
          state.form = action.payload;
          state.editing = false;
        } else {
          state.loading = false;
          state.error = 'Failed to update navbar';
        }
      })
      .addCase(updateNavbar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setForm, setEditing, resetForm } = navbarSlice.actions;
export default navbarSlice.reducer;

