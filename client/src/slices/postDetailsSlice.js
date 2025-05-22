import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for getting post details
export const getPostDetails = createAsyncThunk(
  "post/getPostDetails",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/post/detail/${postId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  post: {},
  error: null,
};

// Slice
const postDetailsSlice = createSlice({
  name: "postDetails",
  initialState,
  reducers: {
    resetPostDetails: (state) => {
      state.loading = false;
      state.post = {};
    },
    clearPostDetailsErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload.post;
      })
      .addCase(getPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetPostDetails, clearPostDetailsErrors } =
  postDetailsSlice.actions;
export default postDetailsSlice.reducer;
