import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user";
import { Spinner } from "../components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import type { User } from "@/types";
import ActivityFeed from "@/components/admin/ActivityFeed";
import {
  Users as UsersIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  ClipboardList as ClipboardListIcon,
  UsersRound as UsersRoundIcon,
  Eye,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Fetch users for dashboard statistics
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  // Fetch current user profile
  const {
    data: currentUser,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });

  if (usersLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (usersError || profileError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate dashboard statistics
  const totalUsers = users?.length || 0;
  const recentUsers = users?.slice(0, 5) || [];

  const handleViewUser = (id: string) => {
    navigate(`/users/${id}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name || "Admin"}
          </p>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Today
          </p>
          <p className="text-lg font-semibold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">{totalUsers}</p>
              <p className="ml-2 text-sm text-muted-foreground">users</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active in system
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Status
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-emerald-600">Operational</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All systems normal
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Activity
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <TrendingUpIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-purple-600">+12%</p>
              <p className="ml-2 text-sm text-muted-foreground">
                from last week
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Growth rate</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Tasks
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <ClipboardListIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-amber-600">3</p>
              <p className="ml-2 text-sm text-muted-foreground">tasks</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users Section */}
        <Card className="lg:col-span-2 rounded-xl border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <UsersRoundIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full w-10 h-10 flex items-center justify-center text-primary font-semibold border-2 border-primary/30">
                        {user.name ? user.name.charAt(0).toUpperCase() : ""}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleViewUser(user.id)}
                      className="cursor-pointer bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed on the right */}
        <div className="lg:col-span-1">
          <ActivityFeed showHeader={true} />
        </div>
      </div>
    </div>
  );
}
