import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/user`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getAllWorkspacesByOrgId: builder.query({
            query: (orgId) => `/organization/${orgId}`
        }),

        changeRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/change-role/${userId}`,
                method: 'POST',
                body: { role }
            }),
        }),
    })
});

export const {
    useGetAllWorkspacesByOrgIdQuery,
    useChangeRoleMutation,
} = userApi;

export default userApi;