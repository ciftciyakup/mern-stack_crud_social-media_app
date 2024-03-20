import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for saving or unsaving a post
export const savePost = createAsyncThunk(
  "post/savePost",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/post/${postId}`);
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
const savePostSlice = createSlice({
  name: "savePost",
  initialState,
  reducers: {
    resetSavePost: (state) => {
      state.success = false;
      state.message = null;
    },
    clearSavePostErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(savePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetSavePost, clearSavePostErrors } = savePostSlice.actions;
export default savePostSlice.reducer;
