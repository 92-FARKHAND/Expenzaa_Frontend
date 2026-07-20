import { api } from '../baseApi';

export const organizationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //  Create organization
    createOrganization: builder.mutation({
      query: (data) => ({
        url: '/organization/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),

    //  Get organization details
    getOrganizationDetails: builder.query({
      query: (organizationId) => ({
        url: `/organization/getDetails/${organizationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, organizationId) => [
        { type: 'Organization', id: organizationId },
      ],
    }),

    //  Get organizations of current user
    getUserOrganizations: builder.query({
      query: () => ({
        url: '/organization/getUserOrgs',
        method: 'GET',
      }),
      providesTags: ['Organization'],
    }),

    //  Update organization
    updateOrganization: builder.mutation({
      query: ({ organizationId, data }) => ({
        url: `/organization/updateOrg/${organizationId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { organizationId }) => [
        { type: 'Organization', id: organizationId },
      ],
    }),

    //  Delete organization
    deleteOrganization: builder.mutation({
      query: (organizationId) => ({
        url: `/organization/delete/${organizationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organization'],
    }),

    // Invite member
    inviteMember: builder.mutation({
      query: ({ organizationId, data }) => ({
        url: `/organization/invite/${organizationId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),

    // Accept invitation
    acceptInvitation: builder.mutation({
      query: (organizationId) => ({
        url: `/organization/accept/${organizationId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Organization'],
    }),

    //  Reject invitation
    rejectInvitation: builder.mutation({
      query: (organizationId) => ({
        url: `/organization/reject/${organizationId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Organization'],
    }),

    //  Remove member
    removeMember: builder.mutation({
      query: ({ organizationId, memberId }) => ({
        url: `/organization/${organizationId}/remMembers/${memberId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Organization'],
    }),

    // Update member role
    updateMemberRole: builder.mutation({
      query: ({ organizationId, memberId, data }) => ({
        url: `/organization/${organizationId}/updMember/${memberId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Organization'],
    }),

    //  Get organization members
    getOrganizationMembers: builder.query({
      query: (organizationId) => ({
        url: `/organization/${organizationId}/members`,
        method: 'GET',
      }),
      providesTags: (result, error, organizationId) => [
        { type: 'Organization', id: organizationId },
      ],
    }),
  }),
});

//  Export hooks
export const {
  useCreateOrganizationMutation,
  useGetOrganizationDetailsQuery,
  useGetUserOrganizationsQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useInviteMemberMutation,
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useGetOrganizationMembersQuery,
} = organizationApi;
