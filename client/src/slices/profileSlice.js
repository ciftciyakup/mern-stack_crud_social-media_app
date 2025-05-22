import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Ekstra Thunks
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put("/update/profile", userData, config);

      return data.success;
    } catch (error) {
      if (error.response.data.errors)
        return rejectWithValue(
          error.response.data.errors.map((error) => error.msg)
        );
      else return rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put("/update/password", passwords, config);

      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    isUpdated: false,
    error: null,
  },
  reducers: {
    clearProfileErrors: (state) => {
      state.error = null;
    },
    updateProfileReset: (state) => {
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // updateProfile için ekstraReducers
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updatePassword için ekstraReducers
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileErrors, updateProfileReset } = profileSlice.actions;

export default profileSlice.reducer;
