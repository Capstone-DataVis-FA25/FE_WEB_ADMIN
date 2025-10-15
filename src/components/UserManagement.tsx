import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import type { User } from "@/types";
import { userService } from "@/services/user";
import UserDetailSection from "./admin/UserDetailSection";
import UserListSection from "./admin/UserListSection";

export default function UserManagement() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
      {selectedUserId ? (
        <UserDetailSection
          userId={selectedUserId}
          onBack={() => setSelectedUserId(null)}
        />
      ) : (
        users && (
          <UserListSection users={users} onViewDetail={setSelectedUserId} />
        )
      )}
    </div>
  );
}
