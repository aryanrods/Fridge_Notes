import { useState } from "react";
import { BrowserRouter, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreateHousePage from "./pages/CreateHousePage";
import JoinHousePage from "./pages/JoinHousePage";
import HouseDetailPage from "./pages/HouseDetailPage";
import InvitePage from "./pages/InvitePage";
import LoadingSpinner from "./components/LoadingSpinner";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return chuldren;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      path="/login"
      element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <GuestRoute>
          <SignupPage />
        </GuestRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/houses/create"
      element={
        <ProtectedRoute>
          <CreateHousePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/houses/join"
      element={
        <ProtectedRoute>
          <JoinHousePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/houses/:id"
      element={
        <ProtectedRoute>
          <HouseDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/houses/:id/invite"
      element={
        <ProtectedRoute>
          <InvitePage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default function App() {
  return (
    <>
      <BrowserRouter></BrowserRouter>
    </>
  );
}
