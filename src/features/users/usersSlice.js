import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: '1', name: "Mac Baren" },
  { id: '2', name: "Philip Morris" },
  { id: '3', name: "James Bond" },
];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default usersSlice.reducer;
