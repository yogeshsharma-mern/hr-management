import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import uiReducer from "../features/ui/uislic.js";


export const store = configureStore({
  reducer:{
    auth:authReducer,
    ui:uiReducer,
  }
})