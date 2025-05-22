import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for adding a new post
export const addNewPost = createAsyncThunk(
  "post/addNewPost",
  async (postData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post("/post/new", postData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial state
const initialState = {
  post: {},
  loading: false,
  success: false,
  error: null,
};

// Slice
const newPostSlice = createSlice({
  name: "newPost",
  initialState,
  reducers: {
    resetNewPost: (state) => {
      state.success = false;
    },
    clearNewPostErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.post = action.payload.post;
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetNewPost, clearNewPostErrors } = newPostSlice.actions;
export default newPostSlice.reducer;
