import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import type { CreateUserDto, User } from "@/types";
import { userService } from "@/services/user";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

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

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserDto) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setNewUser({ name: "", email: "", password: "" });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number | string;
      userData: Partial<User>;
    }) => userService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      // Create a proper CreateUserDto object
      const userData: CreateUserDto = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      };
      createUserMutation.mutate(userData);
    }
  };

  const handleUpdateUser = () => {
    if (editingUser && editForm.name && editForm.email) {
      updateUserMutation.mutate({
        id: editingUser.id,
        userData: editForm,
      });
    }
  };

  const handleDeleteUser = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || user.firstName || user.lastName || "",
      email: user.email || "",
    });
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users in the system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new user to the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Name
              </label>
              <Input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter user name"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter user email"
                type="email"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Enter password"
                type="password"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateUser}
              disabled={
                createUserMutation.isPending ||
                !newUser.name ||
                !newUser.email ||
                !newUser.password
              }
              className="w-full"
            >
              {createUserMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create User
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users List</CardTitle>
            <CardDescription>
              Manage existing users ({users?.length || 0} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users?.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No users found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Create a new user to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {editingUser?.id === user.id ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Name"
                          className="border-gray-300 dark:border-gray-600"
                        />
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          placeholder="Email"
                          type="email"
                          className="border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                          {(user.name || user.firstName || user.lastName || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {user.name ||
                              user.firstName ||
                              user.lastName ||
                              "Unnamed User"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {editingUser?.id === user.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={handleUpdateUser}
                            disabled={updateUserMutation.isPending}
                          >
                            {updateUserMutation.isPending ? (
                              <>
                                <Spinner size="sm" className="mr-1" />
                                Saving...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <Spinner size="sm" />
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
