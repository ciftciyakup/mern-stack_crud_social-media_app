import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action creator
export const getAllMessages = createAsyncThunk(
  "messages/getAll",
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/messages/${chatId}`);
      return data.messages;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const allMessageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNewMessage, clearErrors } = allMessageSlice.actions;
export default allMessageSlice.reducer;
