import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  logout,
  setUser,
} from "./features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  credentials: "include", // Sends HttpOnly cookies automatically
});

let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If request succeeded, return it
  if (result?.error?.status !== 401) {
    return result;
  }

  // Don't try to refresh while authenticating
  if (
    typeof args === "object" &&
    (
      args.url === "/user/login" ||
      args.url === "/user/register" ||
      args.url === "/user/auth/refresh"
    )
  ) {
    return result;
  }

  // Prevent multiple refresh requests at the same time
  if (!refreshPromise) {
    refreshPromise = baseQuery(
      {
        url: "/user/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );
  }

  const refreshResult = await refreshPromise;
  refreshPromise = null;

  if (refreshResult.data) {
    // Optional: if refresh endpoint returns the updated user
    if (refreshResult.data.data?.user) {
      api.dispatch(setUser(refreshResult.data.data.user));
    }

    // Retry the original request
    result = await baseQuery(args, api, extraOptions);
  } else {
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Expense",
    "Budget",
    "Category",
    "Organization",
    "SubBudget",
  ],

  endpoints: () => ({}),
});

// Optional: use this for initial auth checks if needed
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  credentials: "include",
});
