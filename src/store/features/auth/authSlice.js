import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,

  // true after the application has checked whether
  // a user session already exists.
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.initialized = true;
    },

    setAccessToken: (state, action) => {
  state.accessToken = action.payload;
  state.initialized = true;
},

setUser: (state, action) => {
  const user = action.payload;

  if (user && !user.currentContext) {
    user.currentContext = {
      type: "solo",
      organizationId: null,
    };
  }

  state.user = user;
  state.initialized = true;
},

// remove it later as not used
    initializeComplete: (state) => {
      state.initialized = true;
    },

    updateUserContext: (state, action) => {
      if (!state.user) return;

      state.user.currentContext = {
        type: action.payload.type,
        organizationId: action.payload.organizationId,
      };
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.initialized = true;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setUser,
  initializeComplete,
  updateUserContext,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

/* Selectors */

export const selectAccessToken = (state) => state.auth.accessToken;

export const selectCurrentUser = (state) => state.auth.user;

export const selectInitialized = (state) => state.auth.initialized;

export const selectIsAuthenticated = (state) =>
  !!state.auth.accessToken && !!state.auth.user;

export const selectUserContext = (state) =>
  state.auth.user?.currentContext || {
    type: "solo",
    organizationId: null,
  };

export const selectIsOrganizationMode = (state) =>
  state.auth.user?.currentContext?.type === "organization";

export const selectIsPersonalMode = (state) =>
  state.auth.user?.currentContext?.type === "solo";
