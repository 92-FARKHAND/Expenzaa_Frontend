import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // or import.meta.env.VITE_API_URL
    credentials: "include", // important for cookies
  }),
  tagTypes: ["User", "Expense"],
  endpoints: () => ({}),
});
