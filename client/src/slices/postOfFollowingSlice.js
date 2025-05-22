import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for getting posts of followings
export const getPostsOfFollowing = createAsyncThunk(
  "posts/getPostsOfFollowing",
  async (page, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/posts?page=${page || 1}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  loading: false,
  totalPosts: 0,
  error: null,
};

// Slice
const postOfFollowingSlice = createSlice({
  name: "postOfFollowing",
  initialState,
  reducers: {
    resetPostOfFollowing: (state) => {
      state.posts = [];
      state.totalPosts = 0;
    },
    clearPostOfFollowingErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostsOfFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostsOfFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [...state.posts, ...action.payload.posts];
        state.totalPosts = action.payload.totalPosts;
      })
      .addCase(getPostsOfFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetPostOfFollowing, clearPostOfFollowingErrors } =
  postOfFollowingSlice.actions;
export default postOfFollowingSlice.reducer;
