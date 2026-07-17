
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











// // const initialState = {
// //   accessToken: null,
// //   user: null,

// //   // true after the application has checked whether
// //   // a user session already exists.
// //   initialized: false,
// // };

// const initialState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers:{
//     setUser: (state, action) => {
//   state.user = action.payload;
//   state.isAuthenticated = true;
// },

// logout: (state) => {
//   state.user = null;
//   state.isAuthenticated = false;
// }
//   }

// //   reducers: {
// //     setCredentials: (state, action) => {
// //       state.accessToken = action.payload.accessToken;
// //       state.user = action.payload.user;
// //       state.initialized = true;
// //     },

// //     setAccessToken: (state, action) => {
// //   state.accessToken = action.payload;
// //   state.initialized = true;
// // },

// // setUser: (state, action) => {
// //   const user = action.payload;

// //   if (user && !user.currentContext) {
// //     user.currentContext = {
// //       type: "solo",
// //       organizationId: null,
// //     };
// //   }

// //   state.user = user;
// //   state.initialized = true;
// // },

// // // remove it later as not used
// //     initializeComplete: (state) => {
// //       state.initialized = true;
// //     },

// //     updateUserContext: (state, action) => {
// //       if (!state.user) return;

// //       state.user.currentContext = {
// //         type: action.payload.type,
// //         organizationId: action.payload.organizationId,
// //       };
// //     },

// //     logout: (state) => {
// //       state.accessToken = null;
// //       state.user = null;
// //       state.initialized = true;
// //     },
// //   },
// });

// // setCredentials,
// // setAccessToken,
// // initializeComplete,
// // updateUserContext,
// export const {
//   setUser,
//   logout,
// } = authSlice.actions;

// export default authSlice.reducer;

// /* Selectors */
// export const selectIsAuthenticated = (state) => !!state.auth.user;

// // export const selectAccessToken = (state) => state.auth.accessToken;

// // export const selectCurrentUser = (state) => state.auth.user;

// // export const selectInitialized = (state) => state.auth.initialized;


// // export const selectIsAuthenticated = (state) =>
// //   !!state.auth.accessToken && !!state.auth.user;

// export const selectUserContext = (state) =>
//   state.auth.user?.currentContext || {
//     type: "solo",
//     organizationId: null,
//   };

// export const selectIsOrganizationMode = (state) =>
//   state.auth.user?.currentContext?.type === "organization";

// export const selectIsPersonalMode = (state) =>
//   state.auth.user?.currentContext?.type === "solo";
