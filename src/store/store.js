import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionSlice';
import filterReducer from './slices/filterSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    filters: filterReducer,
    ui: uiReducer
  }
});
