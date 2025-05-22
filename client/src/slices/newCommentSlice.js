import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for adding a new comment
export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `/post/comment/${postId}`,
        { comment },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for deleting a comment
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/post/${postId}/comments/${commentId}`
      );
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
const newCommentSlice = createSlice({
  name: "newComment",
  initialState,
  reducers: {
    resetNewComment: (state) => {
      state.success = false;
      state.message = null;
    },
    clearNewCommentErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // addNewComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteComment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetNewComment, clearNewCommentErrors } =
  newCommentSlice.actions;
export default newCommentSlice.reducer;
