
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/lib/authService";
import { UserRole } from "@/types";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = authService.getCurrentUser();
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Save the attempted URL for redirecting after login
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [isAuthenticated, location.pathname]);
  
  // Check if the user is authenticated
  if (!isAuthenticated) {
    toast.warning("Please log in to access this page");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Check if the user has the required role
  if (requiredRoles && user) {
    if (!requiredRoles.includes(user.role as UserRole)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
