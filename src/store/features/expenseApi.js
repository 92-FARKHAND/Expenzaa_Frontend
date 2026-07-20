import { api } from "../baseApi.js";

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({

    createExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/expense/expense-create",
        method: "POST",
        body: expenseData,
      }),
      invalidatesTags: ["Expense", "Budget", "Category"],
    }),

    editExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/expense/edit-expense",
        method: "PATCH",
        body: expenseData,
      }),
      invalidatesTags: ["Expense", "Budget", "Category"],
    }),

    getExpenses: builder.query({
      query: () => "/expense/analytics",
      transformResponse: (response) =>
        response.data?.expenses ?? [],
      providesTags: (result = []) => [
        "Expense",
        ...result.map((exp) => ({
          type: "Expense",
          id: exp._id,
        })),
      ],
    }),

    getMonthlyExpenses: builder.query({
      query: () => "/expense/analytics/monthly",
      transformResponse: (response) =>
        response.data?.expenses ?? [],
      providesTags: (result = []) => [
        "Expense",
        ...result.map((exp) => ({
          type: "Expense",
          id: exp._id,
        })),
      ],
    }),

exportExpenses: builder.query({
  query: () => ({
    url: "/expense/exportCSV",
    method: "GET",
    responseHandler: async (response) => {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "monthly-expenses.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return null; 
    },
  }),
  keepUnusedDataFor: 0, // don't cache a null result
}),
    deleteExpense: builder.mutation({
      query: (expenseId) => ({
        url: `/expense/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "Budget", "Category", "SubBudget"],
    }),

  }),

  overrideExisting: false,
});

export const {
  useCreateExpenseMutation,
  useEditExpenseMutation,
  useGetExpensesQuery,
  useGetMonthlyExpensesQuery,
  useLazyExportExpensesQuery,
  useDeleteExpenseMutation,
} = expenseApi;