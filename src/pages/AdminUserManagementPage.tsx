import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user";
import { Spinner } from "../components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import ProfileSection from "../components/admin/ProfileSection";
import ChangePasswordSection from "../components/admin/ChangePasswordSection";
import UserCreationSection from "../components/admin/UserCreationSection";
import UserListSection from "../components/admin/UserListSection";
import UserDetailSection from "../components/admin/UserDetailSection";
import type { User } from "@/types";

export default function AdminUserManagementPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
    isLoading: currentUserLoading,
    error: currentUserError,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });

  if (usersLoading || currentUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (usersError || currentUserError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage admin users and your profile
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6">
          {currentUser && <ProfileSection currentUser={currentUser} />}
          <ChangePasswordSection />
        </div>
        <div className="space-y-6">
          <UserCreationSection />
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
      </div>
    </div>
  );
}
