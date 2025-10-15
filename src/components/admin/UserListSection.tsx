import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/user";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import type { UpdateUserDto, User } from "@/types";

interface UserListSectionProps {
  users: User[];
  onViewDetail?: (userId: string) => void;
}

export default function UserListSection({
  users,
  onViewDetail,
}: UserListSectionProps) {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number | string;
      userData: UpdateUserDto;
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

  // Lock/Unlock user mutation
  const lockUnlockUserMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.lockUnlockUser(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleUpdateUser = () => {
    if (editingUser) {
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

  const handleLockUnlockUser = (id: string, isActive: boolean) => {
    lockUnlockUserMutation.mutate({ id, isActive });
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.firstName || user.name || "",
      email: user.email || "",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-xl font-semibold">Users List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {users?.length === 0 ? (
          <div className="text-center py-12">
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
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No users found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {users?.map((user) => (
              <div
                key={user.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                {editingUser?.id === user.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold text-lg">
                        {(user.name || user.firstName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Editing User
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-3">
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
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingUser(null)}
                        className="px-3"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleUpdateUser}
                        disabled={updateUserMutation.isPending}
                        className="px-3"
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
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold text-lg">
                          {(user.name || user.firstName || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        {user.isActive === false && (
                          <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                          {user.name || user.firstName || "Unnamed User"}
                          {user.role === "ADMIN" && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                              Admin
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email || "No email provided"}
                        </p>
                        <div className="flex items-center mt-1">
                          {user.isActive === false && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                              Locked
                            </span>
                          )}
                          {user.isVerified === false && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(user)}
                        className="px-3"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetail && onViewDetail(user.id)}
                        className="px-3"
                      >
                        View
                      </Button>
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant={
                            user.isActive === false ? "default" : "outline"
                          }
                          onClick={() =>
                            handleLockUnlockUser(user.id, !user.isActive)
                          }
                          disabled={lockUnlockUserMutation.isPending}
                          className="px-3"
                        >
                          {lockUnlockUserMutation.isPending &&
                          lockUnlockUserMutation.variables?.id === user.id ? (
                            <Spinner size="sm" />
                          ) : user.isActive === false ? (
                            "Unlock"
                          ) : (
                            "Lock"
                          )}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserMutation.isPending}
                        className="px-3"
                      >
                        {deleteUserMutation.isPending ? (
                          <Spinner size="sm" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
