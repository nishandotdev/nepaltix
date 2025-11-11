
import { User, UserRole, NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { addNotification } from "./notifications";
import { saveToSession } from "./core";

/**
 * Register a new user
 */
export const register = async (userData: { 
  name: string, 
  email: string, 
  password: string, 
  role: UserRole, 
  adminCode?: string 
}): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> => {
  try {
    // Check if admin registration with correct code
    if (userData.role === UserRole.ADMIN) {
      if (userData.adminCode && userData.adminCode === "NEPAL_ADMIN_2023") {
        userData.role = UserRole.ADMIN;
      } else {
        return { success: false, message: "Invalid admin code for admin registration" };
      }
    }
    
    // Check if organizer with valid code (optional)
    if (userData.role === UserRole.ORGANIZER && userData.adminCode) {
      if (userData.adminCode === "NEPAL_ORGANIZER_2023") {
        // Valid organizer code
      } else {
        // Invalid code but still allow organizer registration
        console.log("Invalid organizer code, proceeding with registration anyway");
      }
    }
    
    console.log("Attempting to register user:", userData.email);
    
    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });
    
    if (error) {
      console.error("Registration error from Supabase:", error);
      return { success: false, message: error.message };
    }
    
    if (!data.user) {
      console.error("No user data returned from Supabase");
      return { success: false, message: "Registration failed" };
    }
    
    // Note: Profile and default role are auto-created by the handle_new_user trigger
    // We just need to add additional roles if needed (admin or organizer)
    if (userData.role !== UserRole.USER) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: data.user.id,
          role: userData.role.toLowerCase() as 'admin' | 'organizer' | 'user'
        }]);
        
      if (roleError) {
        console.error("Additional role creation error:", roleError);
        // Continue anyway
      }
    }
    
    // Create welcome notification
    await addNotification(
      'Welcome to TicketNepal',
      `Thank you for joining TicketNepal, ${userData.name}!`,
      NotificationType.SUCCESS,
      data.user.id
    );
    
    const user = {
      id: data.user.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString()
    };
    
    return { 
      success: true, 
      message: 'Registration successful! Please check your email to confirm your account.',
      user
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
