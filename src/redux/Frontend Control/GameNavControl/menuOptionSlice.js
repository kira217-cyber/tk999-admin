import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectToken } from '../../auth/authSlice';
import { baseURL } from '../../../utils/baseURL';

// const API = 'http://localhost:8000/api/v1/admin';

// Thunks
export const fetchMenuOptions = createAsyncThunk(
  'menuOption/fetchMenuOptions',
  async (_, { getState }) => {
    const token = selectToken(getState());
    const response = await fetch(`${baseURL}/menu`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const createMenuOption = createAsyncThunk(
  'menuOption/createMenuOption',
  async (data, { getState }) => {
    const token = selectToken(getState());
    const response = await fetch(`${baseURL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const createdMenuOption = await response.json();
    return createdMenuOption;
  }
);

export const updateMenuOption = createAsyncThunk(
  'menuOption/updateMenuOption',
  async ({ id, data }, { getState }) => {
    const token = selectToken(getState());
    const response = await fetch(`${baseURL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const updatedMenuOption = await response.json();
    return updatedMenuOption;
  }
);

export const deleteMenuOption = createAsyncThunk(
  'menuOption/deleteMenuOption',
  async (id, { getState }) => {
    const token = selectToken(getState());
    await fetch(`${baseURL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  }
);

const menuOptionSlice = createSlice({
  name: 'menuOption',
  initialState: {
    menuOptions: [],
    form: { title: '', image: '' },
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
      state.form = { title: '', image: '' };
      state.editingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.menuOptions = action.payload;
      })
      .addCase(fetchMenuOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createMenuOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuOption.fulfilled, (state, action) => {
        state.loading = false;
        state.menuOptions.push(action.payload);
        state.form = { title: '', image: '' };
      })
      .addCase(createMenuOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateMenuOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuOption.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.menuOptions.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.menuOptions[index] = action.payload;
        state.form = { title: '', image: '' };
        state.editingId = null;
      })
      .addCase(updateMenuOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteMenuOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuOption.fulfilled, (state, action) => {
        state.loading = false;
        state.menuOptions = state.menuOptions.filter(item => item._id !== action.payload);
      })
      .addCase(deleteMenuOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setForm: setMenuForm, setEditingId: setMenuEditingId, resetForm: resetMenuForm } = menuOptionSlice.actions;
export default menuOptionSlice.reducer;
