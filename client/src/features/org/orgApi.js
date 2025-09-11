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
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Org']
        }),

        updateOrg: builder.mutation({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
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
    useUpdateOrgMutation
} = orgApi;

export default orgApi;