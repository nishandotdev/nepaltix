
import { User, UserRole, NotificationType } from "@/types";
import { saveToSession, clearSession, getStoredSession } from "./core";
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
      // Prevent admin registration without code
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
    
    console.log("User registered successfully, creating profile");
    
    // Manual profile creation after signup to avoid RLS recursion issues
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      
    if (profileError) {
      console.error("Profile creation error:", profileError);
      // We should continue even if profile creation fails as the auth user is created
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
    
    console.log("User authenticated, fetching profile");
    
    // Fetch profile data - using let instead of const to allow reassignment
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      
      // Try to create a profile if it doesn't exist
      if (profileError.message.includes("No rows found")) {
        console.log("Creating missing profile for user");
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: data.user.user_metadata.name || email.split('@')[0],
            email: email,
            role: 'USER'
          });
          
        if (insertError) {
          console.error("Profile creation error:", insertError);
          return { success: false, message: "Failed to create user profile" };
        }
        
        // Retry fetching the profile
        const { data: newProfileData, error: newProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (newProfileError || !newProfileData) {
          console.error("Profile re-fetch error:", newProfileError);
          return { success: false, message: "Failed to fetch user profile" };
        }
        
        profileData = newProfileData;
      } else {
        return { success: false, message: "Failed to fetch user profile" };
      }
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
    
    console.log("Login successful, saving session");
    saveToSession(user);
    
    // Create login notification
    await addNotification(
      'Login Successful',
      `Welcome back, ${user.name}!`,
      NotificationType.SUCCESS,
      user.id
    );
    
    return { success: true, message: 'Login successful', user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: 'An unexpected error occurred during login' };
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  const { user } = getStoredSession();
  
  if (user) {
    // Create logout notification
    addNotification(
      'Logged Out',
      'You have been successfully logged out.',
      NotificationType.INFO,
      user.id
    );
  }
  
  await supabase.auth.signOut();
  clearSession();
};
