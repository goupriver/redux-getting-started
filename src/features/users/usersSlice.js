import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("http://localhost:3003/users");
  const data = await response.json();

  return data;
});

const initialState = [];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // Immer позволяет нам обновлять состояние двумя способами: либо изменяя
      // существующее значение состояния, либо возвращая новый результат.
      return action.payload;
    });
  },
});

export default usersSlice.reducer;
