import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/auth`,
        credentials: 'include',
    }),
    tagTypes: ['Auth'], // used for cache invalidation
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data,
            }),
        }),

        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body: data,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),

        resetPasswordRequest: builder.mutation({
            query: (data) => ({
                url: '/reset-password-request',
                method: 'POST',
                body: data,
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, data }) => ({
                url: `/reset-password/${token}`,
                method: 'POST',
                body: data,
            }),
        }),

        requestOtp: builder.mutation({
            query: (data) => ({
                url: '/otp-request',
                method: 'POST',
                body: data
            }),
        }),

        verifyOtp: builder.mutation({
            query: ({ code }) => ({
                url: '/otp-verify',
                method: 'POST',
                body: { code }
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: '/change-password',
                method: 'POST',
                body: data,
            }),
        }),

        getuserProfile: builder.query({
            query: () => ({
                url: '/profile',
                method: 'GET',
            }),
            providesTags: ['Auth'], // mark this query as providing 'Auth' tag
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/update-profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useResetPasswordRequestMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useUpdateProfileMutation,
    useGetuserProfileQuery,
    useVerifyOtpMutation,
    useRequestOtpMutation
} = authApi;

export default authApi;
