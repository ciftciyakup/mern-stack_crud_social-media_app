import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action creator
export const addNewChat = createAsyncThunk(
  "chat/addNew",
  async (userId, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/newChat",
        { receiverId: userId },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const newChatSlice = createSlice({
  name: "newChat",
  initialState: {
    loading: false,
    success: false,
    chat: null,
    error: null,
  },
  reducers: {
    resetNewChat: (state) => {
      state.success = false;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewChat.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.chat = action.payload.newChat;
      })
      .addCase(addNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetNewChat, clearErrors } = newChatSlice.actions;
export default newChatSlice.reducer;
