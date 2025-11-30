// src/features/auth/authApi.js
import { api } from "../../baseApi.js";
import { setCredentials, clearCredentials } from "./authSlice";


export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Expense"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLazyGetProfileQuery,
  useLogoutMutation,
} = authApi;
