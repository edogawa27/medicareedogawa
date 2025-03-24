import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type UserRole = "patient" | "provider" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<void>;
}

// No more dummy users

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check for saved user in localStorage and Supabase session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      // First check localStorage for backward compatibility
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }

      // Then check Supabase session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { user: supabaseUser } = data.session;

        // Determine role based on email (in a real app, you'd fetch this from your database)
        const email = supabaseUser.email || "";
        let role: UserRole = null;

        if (email.includes("patient")) {
          role = "patient";
        } else if (email.includes("provider")) {
          role = "provider";
        } else if (email.includes("admin")) {
          role = "admin";
        }

        const user = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || email.split("@")[0],
          email: email,
          role: role,
          avatar:
            supabaseUser.user_metadata?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user));
      }
    };

    checkAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Logging in with Supabase:", { email });

      // For demo purposes, allow login with any credentials
      // This is just for testing - in a real app, you'd use the commented code below
      let userData = null;
      let role: UserRole = null;

      // Check if this is a test account
      if (email.includes("patient")) {
        role = "patient";
        userData = {
          id: "patient-123",
          name: "Test Patient",
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
      } else if (email.includes("provider")) {
        role = "provider";
        userData = {
          id: "provider-123",
          name: "Test Provider",
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
      } else if (email.includes("admin")) {
        role = "admin";
        userData = {
          id: "admin-123",
          name: "Test Admin",
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
      } else {
        // Default to patient for demo
        role = "patient";
        userData = {
          id: "user-" + Date.now(),
          name: email.split("@")[0],
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
      }

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on user role
        if (role === "patient") {
          navigate("/patient-dashboard");
        } else if (role === "provider") {
          navigate("/provider-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        }
        return;
      }

      // Real implementation (commented out for demo)
      /*
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error.message);
        throw new Error("Invalid credentials");
      }
      */

      if (data.user) {
        // Handle successful Supabase login
        console.log("Supabase login successful:", data.user);

        // Try to get user data from the database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        let role: UserRole;
        let name: string;
        let avatar: string;

        if (userError || !userData) {
          console.log("User not found in database, using metadata");
          // If user not in database, use metadata or defaults
          role = (data.user.user_metadata?.role as UserRole) || "patient";
          name = data.user.user_metadata?.name || email.split("@")[0];
          avatar =
            data.user.user_metadata?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
        } else {
          // Use data from database
          role = userData.role as UserRole;
          name = userData.name;
          avatar = userData.avatar;
        }

        const user = {
          id: data.user.id,
          name: name,
          email: data.user.email || "",
          role: role,
          avatar: avatar,
        };

        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on user role
        if (role === "patient") {
          navigate("/patient-dashboard");
        } else if (role === "provider") {
          navigate("/provider-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Removed loginWithDummy function

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => {
    try {
      // Register with Supabase
      console.log("Registering with Supabase:", {
        email,
        password,
        name,
        role,
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        console.error("Supabase registration error:", error.message);
        throw new Error(error.message);
      }

      console.log("Registration successful:", data);

      // After successful registration, create a user object and set it
      if (data.user) {
        // Try to manually insert the user into the users table
        // This is a fallback in case the trigger doesn't work
        const { error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: data.user.id,
              name: name,
              email: email,
              role: role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            },
          ])
          .select();

        if (insertError) {
          console.log("Error inserting user into database:", insertError);
          // Continue anyway as the trigger might have worked
        }

        const newUser = {
          id: data.user.id,
          name: name || email.split("@")[0],
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(newUser));

        // Redirect based on user role
        if (role === "patient") {
          navigate("/patient-dashboard");
        } else if (role === "provider") {
          navigate("/provider-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
