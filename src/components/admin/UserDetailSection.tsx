import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/user";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import type { User } from "@/types";

interface UserDetailSectionProps {
  userId: string;
  onBack: () => void;
}

export default function UserDetailSection({
  userId,
  onBack,
}: UserDetailSectionProps) {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => userService.getUserById(userId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-red-100 dark:bg-red-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-500 dark:text-red-400">
              Error loading user details:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <div className="mt-4">
              <Button onClick={onBack}>Back to Users</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">User not found</p>
            <div className="mt-4">
              <Button onClick={onBack}>Back to Users</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Details</CardTitle>
        <Button variant="outline" onClick={onBack}>
          Back to Users
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-semibold text-xl">
                    {(user.name || user.firstName || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.name || user.firstName || "Unnamed User"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    First Name
                  </span>
                  <span className="font-medium">
                    {user.firstName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Last Name
                  </span>
                  <span className="font-medium">
                    {user.lastName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Email
                  </span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    User ID
                  </span>
                  <span className="font-medium">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Role</span>
                  <span className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      }`}
                    >
                      {user.role || "USER"}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Account Status
                  </span>
                  <span className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Email Verified
                  </span>
                  <span className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isVerified
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Account Type
                  </span>
                  <span className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isSocialAccount
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      }`}
                    >
                      {user.isSocialAccount
                        ? "Social Account"
                        : "Regular Account"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Timestamps
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Created At
                  </span>
                  <span className="font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Last Updated
                  </span>
                  <span className="font-medium">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
