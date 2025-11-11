
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get users by role
 */
export const getUsersByRole = async (role: UserRole): Promise<Omit<User, 'password'>[]> => {
  try {
    // Query user_roles to find users with this role, then join with profiles
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        profiles!inner (
          id,
          name,
          email,
          created_at
        )
      `)
      .eq('role', role.toLowerCase() as 'admin' | 'organizer' | 'user');
      
    if (error) {
      console.error("Error fetching users by role:", error);
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.profiles.id,
      name: item.profiles.name,
      email: item.profiles.email,
      role: role,
      createdAt: item.profiles.created_at
    }));
  } catch (error) {
    console.error("Error in getUsersByRole:", error);
    return [];
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
  try {
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (profileError || !profileData) {
      console.error("Error fetching user by ID:", profileError);
      return null;
    }
    
    // Fetch roles
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', id);
      
    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
    }
    
    // Determine the highest role (admin > organizer > user)
    const roles = rolesData?.map(r => r.role) || ['user'];
    let userRole = UserRole.USER;
    if (roles.includes('admin')) {
      userRole = UserRole.ADMIN;
    } else if (roles.includes('organizer')) {
      userRole = UserRole.ORGANIZER;
    }
    
    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      role: userRole,
      createdAt: profileData.created_at
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
};

/**
 * Get all admin users
 */
export const getAllAdmins = async (): Promise<Omit<User, 'password'>[]> => {
  return getUsersByRole(UserRole.ADMIN);
};

/**
 * Update user role
 */
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
  try {
    // Delete existing role if it exists
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', newRole.toLowerCase() as 'admin' | 'organizer' | 'user');
    
    // Insert new role
    const { error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: userId,
        role: newRole.toLowerCase() as 'admin' | 'organizer' | 'user'
      }]);
      
    if (error) {
      console.error("Error updating user role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return false;
  }
};
