import { useAuth } from "@/providers/auth-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    const returnUrl = encodeURIComponent(location.pathname + location.search); 
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }
  if (loading) {
    return <div>Loading...</div>; // Optionally, you can show a loading spinner here
  }

  return <Outlet />;
}
