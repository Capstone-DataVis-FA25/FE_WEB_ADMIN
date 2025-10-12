import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/apiClient";

interface User {
  id: number | string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: "USER" | "ADMIN";
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      // In a real app, you would fetch user data here
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiClient.post("/auth/signin", {
        email,
        password,
      });
      const { access_token, refresh_token, user } = response;

      // Store tokens
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Set auth state
      setIsAuthenticated(true);
      setUser(user);

      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Reset auth state
    setIsAuthenticated(false);
    setUser(null);

    // Redirect to login
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
