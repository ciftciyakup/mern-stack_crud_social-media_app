import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for liking or unliking a post
export const likePost = createAsyncThunk(
  "post/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/post/${postId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  success: false,
  message: null,
  error: null,
};

// Slice
const likePostSlice = createSlice({
  name: "likePost",
  initialState,
  reducers: {
    resetLikePost: (state) => {
      state.success = false;
      state.message = null;
    },
    clearLikeErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(likePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetLikePost, clearLikeErrors } = likePostSlice.actions;
export default likePostSlice.reducer;
