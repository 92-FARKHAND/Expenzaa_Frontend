import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logout } from "../store/features/auth/authSlice";

/*
  1️⃣ Base Query
  - Attaches access token to headers
  - Includes cookies for refresh token
*/

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/*
  2️⃣ Wrapped Query (Interceptor Equivalent)
  - Handles 401
  - Calls refresh
  - Retries original request
  - Logs out if refresh fails
*/

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Attempt refresh
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // Store new access token
      api.dispatch(setAccessToken(refreshResult.data.accessToken));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → logout
      api.dispatch(logout());

      // Redirect to home
      window.location.replace("/");
    }
  }

  return result;
};

/*
  3️⃣ Create API
*/

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