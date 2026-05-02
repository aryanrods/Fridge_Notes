import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
  return children;
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
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              border: "1px solid #E7E2D8",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "#FEFDF8",
              color: "#1C1917",
            },
            success: {
              iconTheme: { primary: "#5C8A48", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#C07355", secondary: "#fff" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
