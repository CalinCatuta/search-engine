import { configureStore } from "@reduxjs/toolkit";
import jobsSlice from "./reducers/jobsSlice.ts";

// Create the store
const store = configureStore({
  reducer: {
    jobs: jobsSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware() // redux-thunk is included by default
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
