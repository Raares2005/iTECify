import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux"; 
import authReducer from "./slices/authSlice";
import {
  middleware as userApiMiddleware,
  userApiReducerPath,
  userApiReducer,
} from "./slices/userApiSlice";

const appReducer = combineReducers({
  auth: authReducer,
  [userApiReducerPath]: userApiReducer,
});

const reducerProxy = (state, action) => {
  if (action.type === "global/reset") {
    return appReducer(undefined, action); // Reset the state to initial state
  }
  return appReducer(state, action);
};



export const store = configureStore({
  reducer: reducerProxy,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiMiddleware),
  devTools: true,
});

export default store;

export const useAppDispatch = () => useDispatch(); 