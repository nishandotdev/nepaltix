
import { User, UserRole, NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { addNotification } from "./notifications";

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
    if (userData.adminCode && userData.adminCode === "NEPAL_ADMIN_2023") {
      userData.role = UserRole.ADMIN;
    } else if (userData.role === UserRole.ADMIN) {
      return { success: false, message: "Invalid admin registration attempt" };
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
    
    // Insert user profile data into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: new Date().toISOString()
      });
      
    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Continue anyway since auth was created successfully
    }
    
    // Create welcome notification
    await addNotification(
      'Welcome to NepalTix',
      `Thank you for joining NepalTix, ${userData.name}!`,
      NotificationType.SUCCESS,
      data.user.id
    );
    
    return { 
      success: true, 
      message: 'Registration successful! Please check your email to confirm your account.',
      user: {
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
