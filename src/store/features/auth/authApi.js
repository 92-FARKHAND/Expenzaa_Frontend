import { api } from "../../baseApi.js";
import {
  setAccessToken,
  setUser,
  startSilentRefresh,
  refreshFailed as refreshFailedAction,
  logout as logoutAction,
  updateUserContext,
} from "./authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ========================
    // 🔹 SIGNUP
    // ========================
// In authApi.js — update signup mutation
signup: builder.mutation({
  query: (formData) => ({ url: "/user/register", method: "POST", body: formData }),
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      dispatch(setAccessToken(data.data.accessToken)); // ✅ backend returns this
      dispatch(setUser(data.data));                    // ✅ createdUser is the root data
    } catch (err) {
      console.error("❌ Signup failed:", err);
    }
  },
}),
    // ========================
    // 🔹 LOGIN
    // ========================
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // ✅ Dispatch access token first → isAuthenticated becomes true
          // Backend sets refresh token in HttpOnly cookie automatically
          dispatch(setAccessToken(data.data.accessToken));
          dispatch(setUser(data.data.user));

        } catch (error) {
          console.error("❌ Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    // ========================
    // 🔹 LOGOUT
    // ========================
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // ✅ Always clear state regardless of server response
          // logoutAction sets refreshFailed: true → router navigates to /login
          dispatch(logoutAction());
        }
      },
      invalidatesTags: ["User", "Expense"],
    }),

    // ========================
    // 🔹 REFRESH TOKEN (Silent Auth)
    // ========================
// In authApi.js
refresh: builder.mutation({
  query: () => ({
    url: "/auth/refresh",
    method: "POST",
  }),
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    // ✅ Signal that refresh is in progress BEFORE the call resolves
    dispatch(startSilentRefresh());

    try {
      const { data } = await queryFulfilled;
      dispatch(setAccessToken(data.accessToken));
      dispatch(setUser(data.user)); // if your endpoint returns user too
    } catch {
      // ✅ Signal failure so the router redirects to /login
      dispatch(refreshFailedAction()); // rename import to avoid conflict with selector
    }
  },
}),
    // ========================
    // ========================
    // 🔹 GET PROFILE
    // ========================
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch (error) {
          // ✅ If profile fetch fails (401), the baseApi interceptor
          // should trigger a refresh — handle silently here
          console.warn("⚠️ Profile fetch failed:", error);
        }
      },
      providesTags: ["User"],
    }),

    // ========================
    // 🔹 CHANGE PASSWORD
    // ========================
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/user/change-password",
        method: "PATCH",
        body: data,
      }),
    }),

    // ========================
    // 🔹 UPDATE PROFILE
    // ========================
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ========================
    // 🔹 UPDATE AVATAR
    // ========================
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/user/update-avatar",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // ========================
    // 🔹 DELETE ACCOUNT
    // ========================
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/user/delete-account",
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // ✅ Always clear state, redirect to /login via refreshFailed flag
          dispatch(logoutAction());
        }
      },
      invalidatesTags: ["User"],
    }),

    // ========================
    // 🔹 SWITCH CONTEXT
    // ========================
    switchContext: builder.mutation({
      query: (data) => ({
        url: "/user/switch-context",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(
              updateUserContext({
                type: data.data.context,
                organizationId: data.data.organizationId,
              })
            );
          }
        } catch (error) {
          console.error("❌ Switch context failed:", error);
        }
      },
      invalidatesTags: ["User", "Expense", "Budget", "Category", "SubBudget"],
    }),
  }),
});

// Export hooks
export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useDeleteAccountMutation,
  useSwitchContextMutation,
} = authApi;