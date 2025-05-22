import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// Sigunp Async Thunk
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (signupData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const response = await axios.post("/signup", signupData, config);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.errors)
        return rejectWithValue(
          error.response.data.errors.map((error) => error.msg)
        );
      else return rejectWithValue(error.response.data.message);
    }
  }
);

// Login Async Thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.post("/login", loginData, config);
      return response.data;
    } catch (error) {
      if (error.response.data.errors)
        return rejectWithValue(
          error.response.data.errors.map((error) => error.msg)
        );
      else return rejectWithValue(error.response.data.message);
    }
  }
);

// Load User Async Thunk
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/me");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Logout Async Thunk
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get("/logout");
      return true;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    loading: false,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    clearUserErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup reducers
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      });

    // Login reducers
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? action.payload
          : "Sunucu hatası. Lütfen tekrar deneyin.";
        toast.error(state.error);
      });

    // Load User reducers
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });

    // Logout reducers
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserErrors } = userSlice.actions;

export default userSlice.reducer;
