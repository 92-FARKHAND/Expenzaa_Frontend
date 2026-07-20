import { api } from "../../baseApi";
import {
  setUser,
  logout,
} from "./authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* LOGIN    */

    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data.user));
        } catch (err) {
          console.error(err);
        }
      },

      invalidatesTags: ["User"],
    }),

    /*    SIGNUP    */

    signup: builder.mutation({
      query: (formData) => ({
        url: "/user/register",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
           dispatch(setUser(data.data.user));

        } catch (err) {
          console.error(err);
        }
      },

      invalidatesTags: ["User"],
    }),

    //  getProfile
   getProfile: builder.query({
  query: () => ({ url: "/user/profile" }),
  providesTags: ["User"],
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
       dispatch(setUser(data.data));    
      } catch (err) {
      console.error(err);
    }
  },
}),

//  Update Prfile
updateProfile: builder.mutation({
  query: (body) => ({ url: "/user/update-profile", method: "PATCH", body }),
  invalidatesTags: ["User"],
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      dispatch(setUser(data.data));
    } catch (err) {
      console.error(err);
    }
  },
}),

    /*    LOGOUT    */

    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },

      invalidatesTags: [
        "User",
        "Expense",
        "Budget",
        "Category",
      ],
    }),

    /*    CHANGE PASSWORD    */

    changePassword: builder.mutation({
      query: (body) => ({
        url: "/user/change-password",
        method: "PATCH",
        body,
      }),
    }),


    /*    UPDATE AVATAR    */

    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/user/update-avatar",
        method: "PATCH",
        body: formData,
      }),

      invalidatesTags: ["User"],
    }),

    /*    DELETE ACCOUNT    */

    deleteAccount: builder.mutation({
      query: () => ({
        url: "/user/delete-account",
        method: "DELETE",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
    }),

    /*    SWITCH CONTEXT    */

switchContext: builder.mutation({
  query: (body) => ({
    url: "/user/switch-context",
    method: "POST",
    body,
  }),

  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      dispatch(setUser(data.data));
    } catch (err) {
      console.error(err);
    }
  },
  invalidatesTags: ["User", "Expense", "Budget", "Category", "SubBudget"],
}),

  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useDeleteAccountMutation,
  useSwitchContextMutation,
} = authApi;