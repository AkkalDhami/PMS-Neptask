import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const inviteApi = createApi({
    reducerPath: 'inviteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/invite`,
        credentials: 'include',
    }),
    tagTypes: ['Org'],
    endpoints: (builder) => ({

        sendInvitation: builder.mutation({
            query: ({ data, orgId }) => ({
                url: `/organization/${orgId}`,
                method: 'POST',
                body: data
            })
        }),

        getInvitationByToken: builder.query({
            query: (token) => `/token/${token}`,
        }),

        acceptInvitation: builder.mutation({
            query: ({ data, token }) => ({
                url: `/token/${token}/accept`,
                method: 'POST',
                body: data,
            }),
        }),

        rejectInvitation: builder.mutation({
            query: ({ data, token }) => ({
                url: `/token/${token}/reject`,
                method: 'POST',
                body: data,
            }),
        }),


    })
});

export const {
    useSendInvitationMutation,
    useAcceptInvitationMutation,
    useRejectInvitationMutation,
    useLazyGetInvitationByTokenQuery
} = inviteApi;

export default inviteApi;