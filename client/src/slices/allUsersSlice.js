import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action creator
export const getSuggestedUsers = createAsyncThunk(
  "user/getSuggestedUsers",
  async () => {
    const response = await axios.get("/users/suggested");
    return response.data.users;
  }
);

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
};

// Slice
const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    clearAllUsersErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSuggestedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuggestedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getSuggestedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Exporting actions and reducer
export const { clearAllUsersErrors } = allUsersSlice.actions;
export default allUsersSlice.reducer;
