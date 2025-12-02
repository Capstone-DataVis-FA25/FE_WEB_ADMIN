import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/apiClient";
import type { User } from "@/types";

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface AuthResponse {
  user: User;
  tokens: Tokens;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Fetch user data
  const fetchUser = async (): Promise<User | null> => {
    try {
      const userData: User = await apiClient.get("/users/me");
      return userData;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!isAuthenticated) return;

    // Only refresh if we don't already have user data
    if (user) return;

    setIsLoading(true);
    try {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
      } else {
        // If we can't fetch user data, log out
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
        try {
          const userData = await fetchUser();
          if (userData) {
            setUser(userData);
          } else {
            // If we can't fetch user data, log out
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to fetch user data on init:", error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiClient.post("/auth/signin", {
        email,
        password,
      });
      const { tokens, user } = response;

      // Store tokens
      localStorage.setItem("authToken", tokens.access_token);
      localStorage.setItem("refreshToken", tokens.refresh_token);

      // Set auth state
      setIsAuthenticated(true);
      setUser(user);

      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Remove any potentially invalid tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Reset auth state
    setIsAuthenticated(false);
    setUser(null);

    // Redirect to login
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    user,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
