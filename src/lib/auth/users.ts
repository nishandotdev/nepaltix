
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get users by role
 */
export const getUsersByRole = async (role: UserRole): Promise<Omit<User, 'password'>[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role);
      
    if (error) {
      console.error("Error fetching users by role:", error);
      return [];
    }
    
    return data.map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as UserRole,
      createdAt: profile.created_at
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      createdAt: data.created_at
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
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
      
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
