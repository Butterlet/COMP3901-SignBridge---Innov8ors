import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) return <Navigate to="/signup" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
