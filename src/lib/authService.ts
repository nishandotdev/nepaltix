
import { User, UserRole, NotificationType } from "@/types";
import { dbService } from "./dbService";
import { toast } from "sonner";

class AuthService {
  private storageKey = 'nepal_ticketing_auth';
  
  constructor() {
    // Initialize users collection if it doesn't exist
    if (!localStorage.getItem(`${dbService.getStoragePrefix()}users`)) {
      localStorage.setItem(`${dbService.getStoragePrefix()}users`, JSON.stringify([]));
      
      // Create a default admin account
      this.register({
        name: 'Admin User',
        email: 'admin@nepaltix.com',
        password: 'admin123',
        role: UserRole.ADMIN
      });
      
      // Create a default organizer account
      this.register({
        name: 'Event Organizer',
        email: 'organizer@nepaltix.com',
        password: 'organizer123',
        role: UserRole.ORGANIZER
      });
    }
  }
  
  private getUsers(): User[] {
    const users = localStorage.getItem(`${dbService.getStoragePrefix()}users`);
    return users ? JSON.parse(users) : [];
  }
  
  private saveUsers(users: User[]): void {
    localStorage.setItem(`${dbService.getStoragePrefix()}users`, JSON.stringify(users));
  }
  
  private saveToSession(user: User): void {
    // Remove password before saving to session
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(this.storageKey, JSON.stringify({
      user: userWithoutPassword,
      isAuthenticated: true
    }));
  }
  
  public register(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...userData
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    // Create welcome notification
    dbService.addNotification(
      'Welcome to NepalTix',
      `Thank you for joining NepalTix, ${newUser.name}!`,
      NotificationType.SUCCESS,
      newUser.id
    );
    
    return { success: true, message: 'Registration successful', user: newUser };
  }
  
  public login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    
    this.saveToSession(user);
    
    return { success: true, message: 'Login successful', user };
  }
  
  public logout(): void {
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
}

export const authService = new AuthService();
