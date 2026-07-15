import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  initialising:false,
  isLoading: true, // ✅ Start true — app checks tokens on mount
  isRefreshing: false, // ✅ Tracks silent refresh in progress
  refreshFailed: false, // ✅ True when refresh token is expired/missing → triggers redirect to /login
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Called after successful login or silent refresh
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.isRefreshing = false;
      state.refreshFailed = false; // ✅ Reset on success
    },

    // 🔹 Set full user object (called alongside setAccessToken after login/refresh)
    setUser: (state, action) => {
      const user = action.payload;

      if (user && !user.currentContext) {
        user.currentContext = {
          type: "solo",
          organizationId: null,
        };
      }

      state.user = user;
      state.isAuthenticated = !!user;
      state.isLoading = false;
      state.isRefreshing = false;
    },

    // 🔹 Called when access token is missing → silent refresh attempt begins
    startSilentRefresh: (state) => {
      state.isRefreshing = true;
      state.isLoading = true;
      state.refreshFailed = false;
    },

    // 🔹 Called when refresh token is expired, missing, or invalid → redirect to /login
    refreshFailed: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isRefreshing = false;
      state.refreshFailed = true; // ✅ Component/router reads this to navigate → /login
    },

    // 🔹 Update context (solo / organization switch)
    updateUserContext: (state, action) => {
      if (state.user) {
        state.user.currentContext = {
          type: action.payload.type || "solo",
          organizationId: action.payload.organizationId || null,
        };
      }
    },

    // 🔹 Full logout — clears everything, triggers /login redirect via refreshFailed flag
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isRefreshing = false;
      state.refreshFailed = true; // ✅ Reuse same flag → router redirects to /login
    },

    // 🔹 Safety net — force clear all loading states
    clearLoading: (state) => {
      state.isLoading = false;
      state.isRefreshing = false;
    },
  },
});

export const {
  setAccessToken,
  setUser,
  startSilentRefresh,
  refreshFailed,
  updateUserContext,
  logout,
  clearLoading,
} = authSlice.actions;

export default authSlice.reducer;

/* ================= SELECTORS ================= */
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectIsRefreshing = (state) => state.auth.isRefreshing;
export const selectRefreshFailed = (state) => state.auth.refreshFailed; // ✅ Used by router to redirect → /login
export const selectUserContext = (state) =>
  state.auth.user?.currentContext || { type: "solo", organizationId: null };
export const selectIsOrganizationMode = (state) =>
  state.auth.user?.currentContext?.type === "organization";
export const selectIsPersonalMode = (state) =>
  state.auth.user?.currentContext?.type === "solo";