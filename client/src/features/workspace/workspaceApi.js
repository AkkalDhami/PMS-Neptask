import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const workspaceApi = createApi({
    reducerPath: "workspaceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/workspace`,
        credentials: "include",
    }),
    tagTypes: ["Workspace", "Org"],

    endpoints: (builder) => ({
        // Get all workspaces with pagination
        getAllWorkspaces: builder.query({
            query: ({ page = 1, limit = 9 }) => `/all?page=${page}&limit=${limit}`,
            providesTags: ["Workspace"], // ✅ important for cache invalidation
        }),

        // Get all workspaces (without pagination)
        getWorkspaces: builder.query({
            query: () => `/`,
            providesTags: ["Workspace"], // ✅ added
        }),

        // Get single workspace
        getWorkspace: builder.query({
            query: (workspaceId) => `/${workspaceId}`,
            providesTags: ["Workspace"], // ✅ added
        }),

        // Create workspace
        createWorkspace: builder.mutation({
            query: ({ orgId, data }) => ({
                url: `/organization/${orgId}/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Workspace"],
        }),

        // Update workspace
        updateWorkspace: builder.mutation({
            query: ({ workspaceId, data }) => ({
                url: `/${workspaceId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Workspace"],
        }),

        // Delete workspace
        deleteWorkspace: builder.mutation({
            query: (workspaceId) => ({
                url: `/${workspaceId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Workspace"],
        }),

        // Add members to workspace
        addMembers: builder.mutation({
            query: ({ workspaceId, members }) => ({
                url: `/${workspaceId}/members`,
                method: "POST",
                body: { members }, // expects array of { user, role, joinedAt }
            }),
            invalidatesTags: ["Workspace", "Org"], // ✅ now safe
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
    useAddMembersMutation,
} = workspaceApi;

export default workspaceApi;
