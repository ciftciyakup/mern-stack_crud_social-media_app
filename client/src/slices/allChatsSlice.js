import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action creator
export const getAllChats = createAsyncThunk(
  "chats/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/chats");
      return data.chats;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = chatsSlice.actions;
export default chatsSlice.reducer;
