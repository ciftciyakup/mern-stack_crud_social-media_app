import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for deleting a post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/post/${postId}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  success: false,
  error: null,
};

// Slice
const deletePostSlice = createSlice({
  name: "deletePost",
  initialState,
  reducers: {
    resetDeletePost: (state) => {
      state.success = false;
    },
    clearDeleteErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetDeletePost, clearDeleteErrors } = deletePostSlice.actions;
export default deletePostSlice.reducer;
