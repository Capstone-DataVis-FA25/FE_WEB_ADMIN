import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user";
import { systemService } from "@/services/system";
import { Spinner } from "../components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UsersIcon, TrendingUpIcon, ClipboardListIcon, ArrowRight, DollarSign } from 'lucide-react';
import type { User } from "@/types/user.types";
import { UserRegistrationChart } from "@/components/dashboard/UserRegistrationChart";
import { ActivityDistributionChart } from "@/components/dashboard/ActivityDistributionChart";

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

  const { data: activities } = useQuery({
    queryKey: ["activityHistory"],
    queryFn: async () => systemService.getActivityLog(),
  });

  // Revenue query
  const {
    data: totalRevenue,
    isLoading: revenueLoading,
    error: revenueError,
  } = useQuery<number>({
    queryKey: ["totalRevenue"],
    queryFn: () => systemService.getTotalRevenue(),
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

        {/* Total Revenue Card (replace System Status) */}
        <Card className="rounded-xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total revenue 
              </CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline min-h-[40px]">
              {revenueLoading ? (
                <span className="text-base text-muted-foreground">Đang tải...</span>
              ) : revenueError ? (
                <span className="text-base text-destructive">Lỗi</span>
              ) : (
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalRevenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Total revenue of the system
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
                {activities?.length || 0}
              </p>
              <p className="ml-2 text-sm text-muted-foreground">
                events
              </p>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium flex items-center gap-1"
              onClick={() => navigate('/admin/activity')}
            >
              View full feed <ArrowRight className="w-3 h-3" />
            </Button>
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
        <UserRegistrationChart users={users || []} />
        <ActivityDistributionChart activities={activities || []} />
      </div>
    </div>
  );
}
