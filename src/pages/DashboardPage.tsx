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
import {
  UsersIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  ClipboardListIcon,
  UsersRoundIcon,
  Eye,
} from "lucide-react";
import type { User } from "@/types/user.types";
import ActivityFeed from "@/components/admin/ActivityFeed";

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

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

  const totalUsers = users?.length || 0;
  const recentUsers = users?.slice(0, 5) || [];

  const handleViewUser = (id: string) => {
    navigate(`/users/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, {currentUser?.name || "Admin"}
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm text-card-foreground rounded-xl p-5 shadow-lg border border-primary/20 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
            Today
          </p>
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Users
              </CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                {totalUsers}
              </p>
              <p className="ml-2 text-sm text-muted-foreground">users</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Active in system
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                System Status
              </CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                Operational
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              All systems normal
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Recent Activity
              </CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <TrendingUpIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                +12%
              </p>
              <p className="ml-2 text-sm text-muted-foreground">
                from last week
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Growth rate
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Pending Tasks
              </CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                <ClipboardListIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                3
              </p>
              <p className="ml-2 text-sm text-muted-foreground">tasks</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-xl border border-border shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <UsersRoundIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg font-bold">Recent Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {recentUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <UsersRoundIcon className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground font-semibold">
                  No users found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/40 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-primary to-accent rounded-xl w-12 h-12 flex items-center justify-center text-primary-foreground font-bold shadow-md">
                        {user.name ? user.name.charAt(0).toUpperCase() : ""}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">
                          {user.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleViewUser(user.id)}
                      className="cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
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

        <div className="lg:col-span-1">
          <ActivityFeed showHeader={true} />
        </div>
      </div>
    </div>
  );
}
