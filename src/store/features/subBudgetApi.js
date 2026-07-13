import { api } from '../baseApi';

export const subBudgetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get sub-budget for a specific category
    getSubBudget: builder.query({
      query: (categoryId) => ({
        url: `/subBudget/getSubBudget/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) => [{ type: "SubBudget", id: categoryId }],
    }),
    getAllSubBudget: builder.query({
      query: () => ({
        url: `/subBudget/getAllSubBudget`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) => [{ type: "SubBudget", id: categoryId }],
    }),

    // ✅ Set/update sub-budget for a specific category
    setSubBudget: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/subBudget/setSubBudget/${categoryId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: "SubBudget", id: categoryId },
        "Budget",      // ✅ Refreshes budget data
        "Category",    // ✅ Refreshes category data
      ],
    }),
  }),
});

// ✅ Export hooks for components
export const { useGetSubBudgetQuery,useGetSubAllBudgetQuery, useSetSubBudgetMutation } = subBudgetApi;
