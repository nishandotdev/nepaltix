
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/lib/authService";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = authService.getCurrentUser();
  
  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // User logged out
          authService.logout();
          navigate('/auth');
        } else if (event === 'SIGNED_IN' && session) {
          // User logged in
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            // Update local storage with new session
            localStorage.setItem('nepal_ticketing_auth', JSON.stringify({
              user: {
                id: session.user.id,
                name: profileData.name,
                email: profileData.email,
                role: profileData.role,
                createdAt: profileData.created_at
              },
              isAuthenticated: true
            }));
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
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
