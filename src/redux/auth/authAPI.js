
import { baseURL } from '../../utils/baseURL.js';
import { loginSuccess, loginFailure, loginStart, checkTokenSuccess, checkTokenFailure, checkTokenStart } from './authSlice';


export const authAPI = {
  login: async (credentials, dispatch) => {
    dispatch(loginStart());

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      console.log(responseData);
      

      if (response.ok) {
        const { token, user } = responseData.data;
        localStorage.setItem('token', token);
        dispatch(loginSuccess({ token, user }));
      } else {
        dispatch(loginFailure(responseData.message));
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  },

  checkToken: async (token, dispatch) => {

    try {
        dispatch(checkTokenStart());
      const response = await fetch(`${baseURL}/check-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const { user, token: newToken } = responseData.data;
        localStorage.setItem('token', newToken);
        dispatch(checkTokenSuccess({ user, token: newToken }));
      } else {
        dispatch(checkTokenFailure('Invalid token'));
      }
    } catch (error) {
      dispatch(checkTokenFailure(error.message));
    }
  },
};

