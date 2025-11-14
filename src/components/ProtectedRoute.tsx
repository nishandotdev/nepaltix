
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
            // Fetch user roles
            const { data: rolesData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
            
            // Determine the highest role
            const roles = rolesData?.map(r => r.role) || ['user'];
            let userRole = 'USER';
            if (roles.includes('admin')) {
              userRole = 'ADMIN';
            } else if (roles.includes('organizer')) {
              userRole = 'ORGANIZER';
            }
            
            // Update local storage with new session
            localStorage.setItem('nepal_ticketing_auth', JSON.stringify({
              user: {
                id: session.user.id,
                name: profileData.name,
                email: profileData.email,
                role: userRole,
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
      // Save the full URL including search params for redirecting after login
      const fullUrl = location.pathname + location.search;
      sessionStorage.setItem("redirectAfterLogin", fullUrl);
    }
  }, [isAuthenticated, location.pathname, location.search]);
  
  // Handle demo accounts
  if (user && user.id.startsWith('demo-')) {
    // Skip role check for demo admin
    if (user.id === 'demo-admin-id') {
      return <>{children}</>;
    }
    
    // For other demos, check role
    if (requiredRoles && !requiredRoles.includes(user.role as UserRole)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  }
  
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
