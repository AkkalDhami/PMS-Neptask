import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/task`,
        credentials: "include",
    }),
    tagTypes: ["Task", 'Project', 'Subtask'],

    endpoints: (builder) => ({

        createTask: builder.mutation({
            query: ({ data }) => ({
                url: `/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Task"],
        }),

        getTasksByProjectId: builder.query({
            query: ({ projectId, page = 1, limit = 10, status, filter, sort, search }) => {
                // Build query parameters
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', limit);

                if (status) params.append('status', status);
                if (filter) params.append('filter', filter);
                if (sort) params.append('sort', sort);
                if (search) params.append('search', search);

                return `/project/${projectId}?${params.toString()}`;
            },
            providesTags: ["Task", "Project"],
        }),

        updateTask: builder.mutation({
            query: ({ taskId, data }) => ({
                url: `/${taskId}/update`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Task",],
        }),

        deleteTask: builder.mutation({
            query: (taskId) => ({
                url: `/${taskId}/delete`,
                method: "DELETE",
            }),
            invalidatesTags: ["Task"],
        }),

        updateTaskStatus: builder.mutation({
            query: ({ taskId, status }) => ({
                url: `/${taskId}/update-status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Task"],
        }),

        addSubtasks: builder.mutation({
            query: ({ taskId, subtasks }) => ({
                url: `/subtask/${taskId}/add-subtasks`,
                method: "POST",
                body: { subtasks },
            }),
            invalidatesTags: ["Subtask", "Task"],
        }),

        deleteSubtask: builder.mutation({
            query: (subtaskId) => ({
                url: `/subtask/delete/${subtaskId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Subtask", "Task"],
        }),
    }),
});

export const {
    useCreateTaskMutation,
    useGetTasksByProjectIdQuery,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskStatusMutation,
    useAddSubtasksMutation,
    useDeleteSubtaskMutation,
} = taskApi;

export default taskApi;