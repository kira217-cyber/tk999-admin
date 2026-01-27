import { createSlice } from "@reduxjs/toolkit";
import { fetchGames, createGame, updateGame, deleteGame } from "./GameControlAPI";

const gameControlSlice = createSlice({
  name: 'gameControl',
  initialState: {
    gameControl: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    successMessage: '',
  },
  reducers: {
    setGameControl(state, action) {
      state.gameControl = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.errorMessage = '';
      state.successMessage = 'Game control fetched successfully';
    },
    setGameControlLoading(state) {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
      state.successMessage = '';
    },
    setGameControlError(state, action) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = action.payload;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gameControl = action.payload;
        state.successMessage = 'Game control fetched successfully';
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.successMessage = '';
      })
      .addCase(createGame.fulfilled, (state, action) => {
        // Backend returns created game object
        const created = action.payload;
        if (created && created._id) {
          state.gameControl.push(created);
        }
        state.isSuccess = true;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        // Backend returns updated game object
        const updated = action.payload;
        if (updated && updated._id) {
          const idx = state.gameControl.findIndex(g => g._id === updated._id);
          if (idx !== -1) {
            state.gameControl[idx] = updated;
          }
        }
        state.isSuccess = true;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        const id = action.payload;
        state.gameControl = state.gameControl.filter(g => g._id !== id);
        state.isSuccess = true;
      });
  },
});

export const { setGameControl, setGameControlLoading, setGameControlError } = gameControlSlice.actions;
export default gameControlSlice.reducer;

