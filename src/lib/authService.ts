
import { User, UserRole, NotificationType } from "@/types";
import { dbService } from "./dbService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Import all the modules
import { 
  getStoredSession, 
  saveToSession, 
  clearSession, 
  initAuthState,
  isAuthenticated,
  isAdmin
} from "./auth/core";

import { register } from "./auth/register";
import { login } from "./auth/login";
import { logout } from "./auth/logout";

import {
  getUsersByRole,
  getUserById,
  getAllAdmins,
  updateUserRole
} from "./auth/users";

import { addNotification } from "./auth/notifications";

class AuthService {
  private storageKey = 'nepal_ticketing_auth';
  
  constructor() {
    // Initialize auth state from supabase session if available
    this.initAuthState();
    
    // Set up auth state change listener
    this.setupAuthListener();
  }
  
  // Initialize auth state from Supabase session
  private async initAuthState() {
    console.log('Initializing auth state...');
    await initAuthState();
  }
  
  // Set up auth state change listener
  private setupAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        clearSession();
      } else if (event === 'SIGNED_IN' && session) {
        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
            
        if (profileData && !error) {
          saveToSession({
            id: session.user.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role as UserRole,
            createdAt: profileData.created_at
          });
        }
      }
    });
  }
  
  // Register a new user
  public async register(userData: { 
    name: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    adminCode?: string 
  }): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
    return register(userData);
  }
  
  // Login a user
  public async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
    return login(email, password);
  }
  
  // Logout the current user
  public async logout(): Promise<void> {
    await logout();
  }
  
  // Get the current user
  public getCurrentUser(): { user: Omit<User, 'password'> | null; isAuthenticated: boolean } {
    return getStoredSession();
  }
  
  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    return isAuthenticated();
  }
  
  // Get users by role
  public async getUsersByRole(role: UserRole): Promise<Omit<User, 'password'>[]> {
    return getUsersByRole(role);
  }
  
  // Get user by ID
  public async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    return getUserById(id);
  }
  
  // Get all admin users
  public async getAllAdmins(): Promise<Omit<User, 'password'>[]> {
    return getAllAdmins();
  }
  
  // Update user role
  public async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    return updateUserRole(userId, newRole);
  }
  
  // Check if user is an admin
  public isAdmin(): boolean {
    return isAdmin();
  }
}

export const authService = new AuthService();
