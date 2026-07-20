
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true, // checking authentication on app startup
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectLoading = (state) => state.auth.loading;

export default authSlice.reducer;
