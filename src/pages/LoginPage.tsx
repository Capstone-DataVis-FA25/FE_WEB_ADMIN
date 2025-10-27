import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      // Redirect happens in the login function
    } catch (err: unknown) {
      console.error("Login error:", err);
      const apiError = err as ApiError;

      // Handle different types of errors
      if (apiError.response?.status === 401) {
        setError("Invalid email or password");
      } else if (apiError.response?.status === 400) {
        setError("Please check your input and try again");
      } else if (apiError.response?.data?.message) {
        setError(apiError.response.data.message);
      } else if (apiError.response?.data?.error) {
        setError(apiError.response.data.error);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/40 rounded-full w-16 h-16 flex items-center justify-center text-primary font-semibold text-2xl mb-4 border-2 border-primary/30">
            A
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <Card className="rounded-xl shadow-lg border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-center">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs text-muted-foreground uppercase tracking-wide mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  className="py-5"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs text-muted-foreground uppercase tracking-wide"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                  className="py-5"
                />
              </div>
              <Button type="submit" className="w-full py-5" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
