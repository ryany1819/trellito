import { useAuth } from "@/providers/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (loading) {
    return <div>Loading...</div>; // Optionally, you can show a loading spinner here
  }

  return <Outlet />;
}
