import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Lazy load dashboard components
const PatientDashboard = lazy(
  () => import("./components/dashboard/PatientDashboard"),
);
const ProviderDashboard = lazy(
  () => import("./components/dashboard/ProviderDashboard"),
);
const AdminDashboard = lazy(
  () => import("./components/dashboard/AdminDashboard"),
);
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Protected route component
const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: JSX.Element;
  allowedRole?: string;
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to appropriate dashboard if user tries to access wrong area
    if (user?.role === "patient") {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (user?.role === "provider") {
      return <Navigate to="/provider-dashboard" replace />;
    } else if (user?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider-dashboard"
            element={
              <ProtectedRoute allowedRole="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect to appropriate dashboard if already logged in */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                user?.role === "patient" ? (
                  <Navigate to="/patient-dashboard" />
                ) : user?.role === "provider" ? (
                  <Navigate to="/provider-dashboard" />
                ) : user?.role === "admin" ? (
                  <Navigate to="/admin-dashboard" />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
