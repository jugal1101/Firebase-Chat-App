import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userslice";
import chatReducer from "./Slices/chatslice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

export default store;
