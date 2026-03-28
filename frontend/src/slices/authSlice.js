import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null; // Clearing the userInfo object in the Redux store.
      localStorage.removeItem('userInfo'); // Removing the 'userInfo' key from local storage.
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;