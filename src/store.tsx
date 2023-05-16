import { configureStore, combineReducers } from "@reduxjs/toolkit";
import searchReducer from "./features/search/searchSlice";

const rootReducer = combineReducers({
  search: searchReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
