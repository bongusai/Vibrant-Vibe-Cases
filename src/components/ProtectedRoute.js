// src/components/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return null; // Or a loading spinner component
  }

  // If user is logged in and tries to access auth pages, redirect to home
  if (
    user &&
    ["/login", "/signup", "/forgot-password"].includes(location.pathname)
  ) {
    return <Navigate to="/" replace />;
  }

  // For protected routes, redirect to login if not authenticated
  if (
    !user &&
    !["/login", "/signup", "/forgot-password"].includes(location.pathname)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
