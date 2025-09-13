import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const workspaceApi = createApi({
    reducerPath: "workspaceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/workspace`,
        credentials: "include",
    }),
    tagTypes: ["Workspace"],
    endpoints: (builder) => ({
        getAllWorkspaces: builder.query({
            query: ({ page = 1, limit = 9 }) => `/all?page=${page}&limit=${limit}`,
            providesTags: (result) =>
                result?.workspaces
                    ? [
                        ...result.workspaces.map((w) => ({
                            type: "Workspace",
                            id: w._id,
                        })),
                        { type: "Workspace", id: "LIST" },
                    ]
                    : [{ type: "Workspace", id: "LIST" }],
        }),

        getWorkspaces: builder.query({
            query: () => `/`,
        }),

        getWorkspace: builder.query({
            query: (workspaceId) => `/${workspaceId}`,
            providesTags: (result, error, id) => [{ type: "Workspace", id }],
        }),

        createWorkspace: builder.mutation({
            query: ({ orgId, data }) => ({
                url: `/organization/${orgId}/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Workspace", id: "LIST" }],
        }),

        updateWorkspace: builder.mutation({
            query: ({ workspaceId, data }) => ({
                url: `/${workspaceId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { workspaceId }) => [
                { type: "Workspace", id: workspaceId },
            ],
        }),

        deleteWorkspace: builder.mutation({
            query: (workspaceId) => ({
                url: `/${workspaceId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, workspaceId) => [
                { type: "Workspace", id: workspaceId },
                { type: "Workspace", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetWorkspacesQuery,
    useGetAllWorkspacesQuery,
    useGetWorkspaceQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation,
} = workspaceApi;

export default workspaceApi;
