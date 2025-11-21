import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { userService } from "@/services/user";

import type { User } from "@/types/user.types";
import { AlertCircle } from 'lucide-react';
import UserListSection from "./admin/UserListSection";

export default function UserManagement() {
  // Fetch users with proper caching
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 300000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <Spinner size="lg" className="text-purple-600" />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading user directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load users</AlertTitle>
        <AlertDescription>
          We encountered an error while fetching the user list. Please check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {users && <UserListSection users={users} />}
    </div>
  );
}
