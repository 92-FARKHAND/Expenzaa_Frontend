import { api } from '../baseApi.js';

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({

    createExpense: builder.mutation({
      query: (expenseData) => ({
        url: '/expense/expense-create',
        method: 'POST',
        body: expenseData,
      }),
      // refresh expense list after creating
      invalidatesTags: ['Expense'],
    }),

editExpense: builder.mutation({
  query: (expenseData) => ({
    url: '/expense/edit-expense',
    method: 'PATCH',
    body: expenseData,
  }),
  invalidatesTags: ['Expense'],
}),



    getExpenses: builder.query({
      query: () => '/expense/get-expense',
      transformResponse: (response) => response.data?.expenses ?? [],
      providesTags: (result = []) => [
        'Expense',
        ...result.map((exp) => ({ type: 'Expense', id: exp._id })),
      ],
    }),

    deleteExpense: builder.mutation({
      query: (expenseId) => ({
        url: `/expense/${expenseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, expenseId) => [
        { type: 'Expense', id: expenseId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateExpenseMutation,
  useEditExpenseMutation,
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} = expenseApi;
