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
     getUserCategories : builder.query({
        query:()=> '/category/categories',
        transformResponse: (response) => response.data ?? [],
        providesTags: (result = []) => [
        'Category',
        ...result.map((cat) => ({ type: 'Category', id: cat._id })),
      ],
     }),
     deleteCategory : builder.mutation({
        query:(categoryId)=>({
         url:'/category/${categoryId}',
         method:'DELETE'
        }),
        invalidatesTags:({categoryId})=>[{ type:'Category' , id:{categoryId}}]
     })

    })
});

export const {
    useCreateCategoryMutation,
    useGetUserCategoriesQuery,
    useDeleteCategoryMutation
} = categoryApi