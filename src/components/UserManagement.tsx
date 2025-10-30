import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { userService } from "@/services/user";
import UserListSection from "./admin/UserListSection";
import type { User } from "@/types/user.types";

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
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {users && <UserListSection users={users} />}
    </div>
  );
}
