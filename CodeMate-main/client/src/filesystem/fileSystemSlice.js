import { createSlice } from '@reduxjs/toolkit';

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState: {
    files: [], // Array to hold created files
  },
  reducers: {
    createFile: (state, action) => {
      state.files.push(action.payload); // Add new file
    },
  },
});

export const { createFile } = fileSystemSlice.actions;
export default fileSystemSlice.reducer;
