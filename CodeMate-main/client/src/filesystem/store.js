import { configureStore } from '@reduxjs/toolkit';
import fileSystemReducer from './fileSystemSlice';

const store = configureStore({
  reducer: {
    fileSystem: fileSystemReducer,
  },
});

export default store;
