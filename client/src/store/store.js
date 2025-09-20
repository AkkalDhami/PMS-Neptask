import { configureStore } from "@reduxjs/toolkit";
import authApi from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/ui/theme";

import orgApi from "../features/org/orgApi";
import userApi from "../features/user/userApi";

import inviteApi from "../features/invite/inviteApi";
import workspaceApi from "../features/workspace/workspaceApi";

import projectApi from "../features/project/projectApi";
import taskApi from "../features/task/taskApi";


const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [orgApi.reducerPath]: orgApi.reducer,
        [inviteApi.reducerPath]: inviteApi.reducer,
        [workspaceApi.reducerPath]: workspaceApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [taskApi.reducerPath]: taskApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(
        authApi.middleware,
        orgApi.middleware,
        userApi.middleware,
        inviteApi.middleware,
        workspaceApi.middleware,
        projectApi.middleware,
        taskApi.middleware,
    ),
});

export default store;
