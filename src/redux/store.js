// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice.js';
import userCustomerReducer from './userFrontend/userFrontendSlice.js';
import carouselControlReducer from './Frontend Control/CarouselControl/CarouselControlSlice.js';
import noticeControlSlice from './Frontend Control/Notice Control/noticeControlSlice.js';
import menuOptionReducer from './Frontend Control/GameNavControl/menuOptionSlice.js';
import navBarOptionReducer from './Frontend Control/GameNavControl/navbarSlice.js';
import subOptionReducer from './Frontend Control/GameNavControl/subOptionSlice';
import imageReducer from './Frontend Control/GameNavControl/imageSlice.js';
import gameControlReducer from './Frontend Control/GameControl/GameControlSlice.js';
import promotionControlReducer from './Deposit Control/promotionControlAPIAndSlice.js'
import depositPaymentGatewayReducer from './Deposit Control/depositPaymentGetawaySliceAndAPI.js';
import withdrawPaymentMethodsReducer from './Withdraw Control/withdrawPaymentGetawaySliceAndApi.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    userCustomer: userCustomerReducer,
    homePageCarousel : carouselControlReducer,
    noticeControl : noticeControlSlice,
    navbar : navBarOptionReducer,
    menuOption: menuOptionReducer,
    subOption: subOptionReducer,
    image: imageReducer,
    gameControl : gameControlReducer,
    promotion : promotionControlReducer,
    depositPaymentGateway : depositPaymentGatewayReducer,
    withdrawPaymentGateway : withdrawPaymentMethodsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export default store;

