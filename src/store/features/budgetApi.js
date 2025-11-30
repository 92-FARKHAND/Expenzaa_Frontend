import {api} from '../baseApi'

export const budgetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get current user budget details
    getUserBudget: builder.query({
      query: () => ({
        url: "/budget/detail",
        method: "GET",
      }),
      providesTags: ["Budget"], // helpful for cache invalidation
    }),

    // ✅ Edit user budget
    editBudget: builder.mutation({
      query: (data) => ({
        url: "/budget/edit",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Budget"], // auto-refetch after update
    }),
  }),
});

// ✅ Export hooks for components
export const { useGetUserBudgetQuery, useEditBudgetMutation } = budgetApi;
