import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  logout,
  setAccessToken,
  setUser,
} from "./features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status !== 401) {
    return result;
  }

  // don't refresh while logging in
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
    api.dispatch(
      setAccessToken(
        refreshResult.data.data.accessToken
      )
    );

    api.dispatch(
      setUser(
        refreshResult.data.data.user
      )
    );

    result = await baseQuery(
      args,
      api,
      extraOptions
    );
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

// Used only for initial authentication check
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  credentials: "include",
});