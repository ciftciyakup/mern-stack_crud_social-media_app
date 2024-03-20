import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserDetails = createAsyncThunk(
  "userDetails/getUserDetails",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/${username}`);
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Bir hata oluştu";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserDetailsById = createAsyncThunk(
  "user/getUserDetailsById",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/userdetails/${userId}`);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: { user: {}, loading: false, error: null },
  reducers: {
    clearUserDetailsErrors: (state) => {
      state.error = null;
    },
    resetUserDetails: (state) => {
      state.user = {};
    },
  },
  extraReducers: (builder) => {
    builder

      // getUserDetails
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // getUserDetailsById
      .addCase(getUserDetailsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUserDetailsErrors, resetUserDetails } =
  userDetailsSlice.actions;

export default userDetailsSlice.reducer;
