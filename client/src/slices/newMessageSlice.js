import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action creator
export const sendMessage = createAsyncThunk(
  "message/send",
  async (msgData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post("/newMessage/", msgData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const newMessageSlice = createSlice({
  name: "message",
  initialState: {
    loading: false,
    success: false,
    newMessage: {},
    error: null,
  },
  reducers: {
    resetMessage: (state) => {
      state.success = false;
      state.newMessage = {};
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.newMessage = action.payload.newMessage;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, clearErrors } = newMessageSlice.actions;
export default newMessageSlice.reducer;
