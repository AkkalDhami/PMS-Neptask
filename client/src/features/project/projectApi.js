import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateProjectActive } from "../../../../server/src/controllers/projectController";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/project`,
        credentials: "include",
    }),
    tagTypes: ["Project"],

    endpoints: (builder) => ({

        getProjectsByWorkspace: builder.query({
            query: ({ workspaceId, page = 1, limit = 10 }) =>
                `/${workspaceId}?page=${page}&limit=${limit}`,
            providesTags: (result) => {
                if (!result?.projects) return [{ type: "Project", id: "LIST" }];
                return [
                    ...result.projects.map((p) => ({ type: "Project", id: p._id })),
                    { type: "Project", id: "LIST" },
                ];
            },
        }),

        getProjects: builder.query({
            query: () => `/`
        }),

        getAllProjects: builder.query({
            query: ({ page = 1, limit = 10, search }) =>
                `/all?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result) => {
                if (!result?.projects) return [{ type: "Project", id: "LIST" }];
                return [
                    ...result.projects.map((p) => ({ type: "Project", id: p._id })),
                    { type: "Project", id: "LIST" },
                ];
            },
        }),

        getProject: builder.query({
            query: (projectId) => `/${projectId}`,
            providesTags: (result, error, id) => [{ type: "Project", id }],
        }),

        createProject: builder.mutation({
            query: ({ data }) => ({
                url: `/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Project", id: "LIST" }],
        }),

        updateProject: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `/update/${projectId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Project", id: projectId },
            ],
        }),

        deleteProject: builder.mutation({
            query: (projectId) => ({
                url: `/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, projectId) => [
                { type: "Project", id: projectId },
                { type: "Project", id: "LIST" },
            ],
        }),

        updateProjectActive: builder.mutation({
            query: ({ projectId, isActive }) => ({
                url: `/update-active/${projectId}`,
                method: "PATCH",
                body: { isActive },
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Project", id: projectId },
            ],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectsByWorkspaceQuery,
    useGetProjectQuery,
    useGetAllProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useUpdateProjectActiveMutation
} = projectApi;

export default projectApi;
