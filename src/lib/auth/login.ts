
import { User, UserRole, NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { addNotification } from "./notifications";
import { saveToSession } from "./core";

/**
 * Login a user
 */
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> => {
  try {
    console.log("Attempting login for:", email);
    
    // Handle demo accounts first
    if (email === "admin@nepaltix.com" && password === "admin123") {
      console.log("Using admin demo account");
      const demoUser = {
        id: "demo-admin-id",
        name: "Admin User",
        email: "admin@nepaltix.com",
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString()
      };
      saveToSession(demoUser);
      return { success: true, message: 'Demo login successful', user: demoUser };
    }
    
    if (email === "organizer@nepaltix.com" && password === "organizer123") {
      console.log("Using organizer demo account");
      const demoUser = {
        id: "demo-organizer-id",
        name: "Organizer User",
        email: "organizer@nepaltix.com",
        role: UserRole.ORGANIZER,
        createdAt: new Date().toISOString()
      };
      saveToSession(demoUser);
      return { success: true, message: 'Demo login successful', user: demoUser };
    }
    
    if (email === "user@nepaltix.com" && password === "user123") {
      console.log("Using regular user demo account");
      const demoUser = {
        id: "demo-user-id",
        name: "Regular User",
        email: "user@nepaltix.com",
        role: UserRole.USER,
        createdAt: new Date().toISOString()
      };
      saveToSession(demoUser);
      return { success: true, message: 'Demo login successful', user: demoUser };
    }
    
    // Clear any previous session before attempting login
    localStorage.removeItem('nepal_ticketing_auth');
    
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
    
    if (!data || !data.user) {
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
        
      if (profileError || !profileData) {
        console.error("Profile fetch error:", profileError);
        
        // If profile doesn't exist, create it using auth metadata
        const userData = data.user.user_metadata || {};
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: userData.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
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
        
        // Save user to session
        saveToSession(user);
        
        // Create login notification
        await addNotification(
          'Login Successful',
          `Welcome back, ${user.name}!`,
          NotificationType.SUCCESS,
          user.id
        ).catch(err => console.error("Error adding notification:", err));
        
        return { success: true, message: 'Login successful', user };
      }
      
      const user = {
        id: data.user.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        createdAt: profileData.created_at
      };
      
      // Save user to session
      saveToSession(user);
      
      // Create login notification
      await addNotification(
        'Login Successful',
        `Welcome back, ${user.name}!`,
        NotificationType.SUCCESS,
        user.id
      ).catch(err => console.error("Error adding notification:", err));
      
      return { success: true, message: 'Login successful', user };
      
    } catch (profileError) {
      console.error("Profile processing error:", profileError);
      return { success: false, message: "Failed to process user profile" };
    }
    
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, message: 'An unexpected error occurred during login' };
  }
};
