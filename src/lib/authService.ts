import { User, UserRole, NotificationType } from "@/types";
import { dbService } from "./dbService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

class AuthService {
  private storageKey = 'nepal_ticketing_auth';
  
  constructor() {
    // Initialize auth state from supabase session if available
    this.initAuthState();
  }
  
  private async initAuthState() {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData && !error) {
          this.saveToSession({
            id: data.session.user.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role as UserRole,
            createdAt: profileData.created_at
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
    }
  }
  
  private saveToSession(user: Omit<User, 'password'>): void {
    localStorage.setItem(this.storageKey, JSON.stringify({
      user: user,
      isAuthenticated: true
    }));
  }
  
  public async register(userData: { name: string, email: string, password: string, role: UserRole }): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
    try {
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
        return { success: false, message: error.message };
      }
      
      if (!data.user) {
        return { success: false, message: "Registration failed" };
      }
      
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
      await dbService.addNotification(
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
  }
  
  public async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Email not confirmed")) {
          return { success: false, message: "Please check your email to confirm your account before logging in." };
        }
        return { success: false, message: error.message || "Login failed" };
      }
      
      if (!data.user) {
        return { success: false, message: "Login failed" };
      }
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return { success: false, message: "Failed to fetch user profile" };
      }
      
      if (!profileData) {
        // Create profile if it doesn't exist (fallback)
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
      }
      
      const user = {
        id: data.user.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        createdAt: profileData.created_at
      };
      
      this.saveToSession(user);
      
      // Create login notification
      await dbService.addNotification(
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
  }
  
  public async logout(): Promise<void> {
    const { user } = this.getCurrentUser();
    
    if (user) {
      // Create logout notification
      dbService.addNotification(
        'Logged Out',
        'You have been successfully logged out.',
        NotificationType.INFO,
        user.id
      );
    }
    
    await supabase.auth.signOut();
    localStorage.removeItem(this.storageKey);
  }
  
  public getCurrentUser(): { user: Omit<User, 'password'> | null; isAuthenticated: boolean } {
    const authData = localStorage.getItem(this.storageKey);
    
    if (!authData) {
      return { user: null, isAuthenticated: false };
    }
    
    return JSON.parse(authData);
  }
  
  public isAuthenticated(): boolean {
    return this.getCurrentUser().isAuthenticated;
  }
  
  public async getUsersByRole(role: UserRole): Promise<Omit<User, 'password'>[]> {
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
  }
  
  public async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
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
  }
}

export const authService = new AuthService();
