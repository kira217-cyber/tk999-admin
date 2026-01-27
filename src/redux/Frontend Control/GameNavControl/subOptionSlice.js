import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { selectToken } from '../../auth/authSlice';
import { baseURL } from '../../../utils/baseURL';




// Thunks
export const fetchSubOptions = createAsyncThunk(
  'subOption/fetchSubOptions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.get(`${baseURL}/submenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error fetching sub options');
    }
  }
);

export const fetchMenuOptionsForSub = createAsyncThunk(
  'subOption/fetchMenuOptionsForSub',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.get(`${baseURL}/menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error fetching menu options');
    }
  }
);

export const createSubOption = createAsyncThunk(
  'subOption/createSubOption',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.post(`${baseURL}/submenu`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error creating sub option');
    }
  }
);

export const updateSubOption = createAsyncThunk(
  'subOption/updateSubOption',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      const response = await axios.put(`${baseURL}/submenu/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error updating sub option');
    }
  }
);

export const deleteSubOption = createAsyncThunk(
  'subOption/deleteSubOption',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = selectToken(getState());
      await axios.delete(`${baseURL}/submenu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error deleting sub option');
    }
  }
);

const subOptionSlice = createSlice({
  name: 'subOption',
  initialState: {
    subOptions: [],
    menuOptionsForSub: [],
    form: { title: '', image: '', parentMenuOption: '' },
    editingId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    resetForm: (state) => {
      state.form = { title: '', image: '', parentMenuOption: '' };
      state.editingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subOptions = action.payload;
      })
      .addCase(fetchSubOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMenuOptionsForSub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuOptionsForSub.fulfilled, (state, action) => {
        state.loading = false;
        state.menuOptionsForSub = action.payload;
      })
      .addCase(fetchMenuOptionsForSub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubOption.fulfilled, (state, action) => {
        state.loading = false;
        state.subOptions.push(action.payload);
        state.form = { title: '', image: '', parentMenuOption: '' };
      })
      .addCase(createSubOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubOption.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subOptions.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.subOptions[index] = action.payload;
        state.form = { title: '', image: '', parentMenuOption: '' };
        state.editingId = null;
      })
      .addCase(updateSubOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubOption.fulfilled, (state, action) => {
        state.loading = false;
        state.subOptions = state.subOptions.filter(item => item._id !== action.payload);
      })
      .addCase(deleteSubOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setForm: setSubForm, setEditingId: setSubEditingId, resetForm: resetSubForm } = subOptionSlice.actions;
export default subOptionSlice.reducer;
