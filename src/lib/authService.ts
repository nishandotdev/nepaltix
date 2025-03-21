
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
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
        
      if (profileData) {
        this.saveToSession({
          id: data.session.user.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as UserRole,
          createdAt: profileData.created_at
        });
      }
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
      
      // The trigger will create the profile automatically
      
      // Create welcome notification
      dbService.addNotification(
        'Welcome to NepalTix',
        `Thank you for joining NepalTix, ${userData.name}!`,
        NotificationType.SUCCESS,
        data.user.id
      );
      
      return { 
        success: true, 
        message: 'Registration successful',
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
        return { success: false, message: error.message };
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
        return { success: false, message: profileError.message };
      }
      
      if (!profileData) {
        return { success: false, message: "User profile not found" };
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
      dbService.addNotification(
        'Login Successful',
        `Welcome back, ${user.name}!`,
        NotificationType.SUCCESS,
        user.id
      );
      
      return { success: true, message: 'Login successful', user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'An unexpected error occurred' };
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
