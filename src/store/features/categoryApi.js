import { api } from "../baseApi";
export const categoryApi = api.injectEndpoints({
    endpoints:(builder) =>({
     createCategory: builder.mutation({
        query:(categoryData)=>({
            url:'/category/create-category',
            method:"POST",
            body:categoryData
        }),
        invalidatesTags:['Category'],
     }),
getCategories: builder.query({
  query: () => "/category/categories",
  transformResponse: (response) => response.data?.categories ?? [],
  providesTags: (result = []) => [
    { type: "Category", id: "LIST" },
    ...result.map((cat) => ({ type: "Category", id: cat._id })),
  ],
}),

deleteCategory: builder.mutation({
  query: (categoryId) => ({
    url: `/category/${categoryId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Category"],
}),

    })
});

export const {
    useCreateCategoryMutation,
    useGetCategoriesQuery,
    useDeleteCategoryMutation
} = categoryApi