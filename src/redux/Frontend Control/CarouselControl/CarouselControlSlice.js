import { createSlice } from '@reduxjs/toolkit';
import { getCarouselImages, updateCarouselImages } from './carouselControlAPI';

const initialState = {
    _id: '',
    images: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    successMessage: '',
    isActive: true,
    interval: 2500,
    infiniteLoop: true,
    autoPlay: true
};

const carouselControlSlice = createSlice({
    name: 'carouselControl',
    initialState,
    reducers: {
        setImages: (state, action) => {
            state.images = action.payload;
        },
        setIsActive: (state, action) => {
            state.isActive = action.payload;
        },
        setInterval: (state, action) => {
            state.interval = action.payload;
        },
        setInfiniteLoop: (state, action) => {
            state.infiniteLoop = action.payload;
        },
        setAutoPlay: (state, action) => {
            state.autoPlay = action.payload;
        },
        setId: (state, action) => {
            state._id = action.payload;
        },
        resetCarouselControlState: (state) => {
            return { ...initialState };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCarouselImages.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(getCarouselImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state._id = action.payload._id;
                state.images = action.payload.images || [];
                state.isActive = action.payload.isActive;
                state.interval = action.payload.interval;
                state.infiniteLoop = action.payload.infiniteLoop;
                state.autoPlay = action.payload.autoPlay;
                state.successMessage = 'Carousel images fetched successfully';
            })
            .addCase(getCarouselImages.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.errorMessage = action.payload || 'Failed to fetch carousel images';
            })
            .addCase(updateCarouselImages.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(updateCarouselImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state._id = action.payload._id;
                state.images = action.payload.images;
                state.isActive = action.payload.isActive;
                state.interval = action.payload.interval;
                state.infiniteLoop = action.payload.infiniteLoop;
                state.autoPlay = action.payload.autoPlay;
                state.successMessage = 'Carousel images updated successfully';
            })
            .addCase(updateCarouselImages.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.errorMessage = action.payload || 'Failed to update carousel images';
            });
    }
});

export const {
    setImages,
    setIsActive,
    setInterval,
    setInfiniteLoop,
    setAutoPlay,
    setId,
    resetCarouselControlState
} = carouselControlSlice.actions;

export default carouselControlSlice.reducer;