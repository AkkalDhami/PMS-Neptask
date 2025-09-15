import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const orgApi = createApi({
    reducerPath: 'orgApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/org`,
        credentials: 'include',
    }),
    tagTypes: ['Org'],
    endpoints: (builder) => ({
        getAllOrgs: builder.query({
            query: () => '/',
            providesTags: ['Org']
        }),

        getOrg: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['Org']
        }),

        createOrg: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Org']
        }),

        deleteOrg: builder.mutation({
            query: ({ orgId, reason }) => ({
                url: `/${orgId}/delete-request`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['Org']
        }),

        recoverOrg: builder.mutation({
            query: ({ orgId }) => ({
                url: `/${orgId}/recover`,
                method: 'POST',
            }),
            invalidatesTags: ['Org']
        }),

        updateOrg: builder.mutation({
            query: ({ orgId, data }) => ({
                url: `/update/${orgId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Org']
        }),

        removeMember: builder.mutation({
            query: ({ orgId, memberId }) => ({
                url: `/${orgId}/members/${memberId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Org']
        }),

        updateMemberRole: builder.mutation({
            query: ({ orgId, memberId, role }) => ({
                url: `/${orgId}/members/${memberId}`,
                method: 'PUT',
                body: { role }
            }),
            invalidatesTags: ['Org']
        }),

    })
});

export const {
    useGetAllOrgsQuery,
    useLazyGetOrgQuery,
    useCreateOrgMutation,
    useDeleteOrgMutation,
    useUpdateOrgMutation,
    useRemoveMemberMutation,
    useUpdateMemberRoleMutation,
    useRecoverOrgMutation
} = orgApi;

export default orgApi;