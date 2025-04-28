
import { User, UserRole } from "@/types";
import { saveToSession } from "./core";

/**
 * Login a user using demo accounts only
 */
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> => {
  try {
    console.log("Attempting demo login for:", email);
    
    // Handle demo accounts
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
    
    return { success: false, message: 'Invalid email or password. Please use one of the demo accounts.' };
    
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: 'An unexpected error occurred during login' };
  }
};
