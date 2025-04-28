
import { User, UserRole, NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { addNotification } from "./notifications";

/**
 * Login a user
 */
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> => {
  try {
    console.log("Attempting login for:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error from Supabase:", error);
      
      if (error.message.includes("Email not confirmed")) {
        return { success: false, message: "Please check your email to confirm your account before logging in." };
      }
      
      return { success: false, message: error.message || "Login failed" };
    }
    
    if (!data.user) {
      console.error("No user data returned from login");
      return { success: false, message: "Login failed" };
    }
    
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        
        // If profile doesn't exist, create it using auth metadata
        if (profileError.code === 'PGRST116') {
          const userData = data.user.user_metadata;
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: userData.name || 'User',
              email: data.user.email,
              role: userData.role || UserRole.USER,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (insertError) {
            console.error("Profile creation error:", insertError);
            return { success: false, message: "Failed to create user profile" };
          }
          
          const user = {
            id: data.user.id,
            name: newProfile.name,
            email: newProfile.email,
            role: newProfile.role as UserRole,
            createdAt: newProfile.created_at
          };
          
          // Create login notification
          await addNotification(
            'Login Successful',
            `Welcome back, ${user.name}!`,
            NotificationType.SUCCESS,
            user.id
          );
          
          return { success: true, message: 'Login successful', user };
        }
        
        return { success: false, message: "Failed to fetch user profile" };
      }
      
      if (!profileData) {
        console.error("No profile data found");
        return { success: false, message: "User profile not found" };
      }
      
      const user = {
        id: data.user.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        createdAt: profileData.created_at
      };
      
      // Create login notification
      await addNotification(
        'Login Successful',
        `Welcome back, ${user.name}!`,
        NotificationType.SUCCESS,
        user.id
      );
      
      return { success: true, message: 'Login successful', user };
      
    } catch (profileError) {
      console.error("Profile processing error:", profileError);
      return { success: false, message: "Failed to process user profile" };
    }
    
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: 'An unexpected error occurred during login' };
  }
};
