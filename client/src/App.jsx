import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Profile from "./pages/auth/ProfilePage";
import PublicRoute from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import EmailVerify from "./pages/auth/EmailVerify";
import LandingPage from "./pages/others/LandingPage";
import AppLayout from "./components/layout/AppLayout";
import Workspace from "./pages/admin/Workspace";
import Organization from "./pages/admin/Organization";
import Project from "./pages/admin/Project";
import Dashboard from "./pages/admin/Dashboard";
import OrgDetails from "./pages/admin/OrgDetails";
import AcceptInvitation from "./pages/admin/AcceptInvitation";
import ProfilePage from "./pages/admin/Userprofile";
import WorkspaceDetailsPage from "./pages/admin/WorkspaceDetail";
import Authlayout from "./components/layout/Authlayout";
import ProjectDetailsPage from "./pages/admin/ProjectDetail";
import CreateEditTaskPage from "./pages/admin/TaskCreatepage";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <Authlayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
          errorElement: <div>Page Not Found</div>,
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: "/signup",
          element: (
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          ),
        },
        {
          path: "/forgot-password",
          element: (
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          ),
        },
        {
          path: "/email-verify",
          element: (
            <ProtectedRoutes>
              <EmailVerify />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/change-password",
          element: (
            <ProtectedRoutes>
              <ChangePassword />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/reset-password/:token",
          element: (
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          ),
        },
      ],
    },

    {
      element: <AppLayout />,
      children: [
        {
          path: "/my-profile",
          element: (
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/organization",
          element: (
            <ProtectedRoutes>
              <Organization />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/organization/:orgId",
          element: (
            <ProtectedRoutes>
              <OrgDetails />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/workspace",
          element: <Workspace />,
        },
        {
          path: "/workspace/:workspaceId",
          element: <WorkspaceDetailsPage />,
        },
        {
          path: "/project",
          element: <Project />,
        },
        {
          path: "/project/:projectId",
          element: <ProjectDetailsPage />,
        },
        {
          path: "/task-create",
          element: <CreateEditTaskPage />,
        },
      ],
    },
    {
      path: "/invite/organization/:orgId/:token",
      element: <AcceptInvitation />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
