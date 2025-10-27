import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/user";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import {
  User,
  Lock,
  Edit,
  Eye,
  Unlock,
  Lock as LockIcon,
  Trash2,
} from "lucide-react";
import type { UpdateUserDto, User as UserType } from "@/types";

interface UserListSectionProps {
  users: UserType[];
}

export default function UserListSection({ users }: UserListSectionProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
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

  const handleViewUser = (id: string) => {
    navigate(`/users/${id}`);
  };

  const startEditing = (user: UserType) => {
    setEditingUser(user);
    setEditForm({
      name: user.firstName || user.name || "",
      email: user.email || "",
    });
  };

  return (
    <Card className="shadow-sm rounded-xl border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Users List</CardTitle>
          <span className="text-sm text-muted-foreground">
            {users?.length || 0} users
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {users?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users?.map((user) => (
              <div
                key={user.id}
                className="p-4 hover:bg-accent/30 transition-colors"
              >
                {editingUser?.id === user.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full w-12 h-12 flex items-center justify-center text-primary font-semibold text-lg border-2 border-primary/30">
                        {(user.name || user.firstName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          Editing User
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Update user information
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Name
                        </label>
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Email
                        </label>
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          placeholder="Email"
                          type="email"
                          className="mt-1"
                        />
                      </div>
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
                        <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full w-12 h-12 flex items-center justify-center text-primary font-semibold text-lg border-2 border-primary/30">
                          {(user.name || user.firstName || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        {user.isActive === false && (
                          <div className="absolute -top-1 -right-1 bg-destructive rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                            <Lock className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground flex items-center">
                          {user.name || user.firstName || "Unnamed User"}
                          {user.role === "ADMIN" && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Admin
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email || "No email provided"}
                        </p>
                        <div className="flex items-center mt-1 gap-2">
                          {user.isActive === false && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Locked
                            </span>
                          )}
                          {user.isVerified === false && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => startEditing(user)}
                        className="px-3 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleViewUser(user.id)}
                        className="px-3 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            handleLockUnlockUser(user.id, !user.isActive)
                          }
                          disabled={lockUnlockUserMutation.isPending}
                          className={`px-3 ${
                            user.isActive === false
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : "bg-gray-500 hover:bg-gray-600 text-white"
                          }`}
                        >
                          {lockUnlockUserMutation.isPending &&
                          lockUnlockUserMutation.variables?.id === user.id ? (
                            <Spinner size="sm" />
                          ) : user.isActive === false ? (
                            <>
                              <Unlock className="h-4 w-4 mr-1" />
                              Unlock
                            </>
                          ) : (
                            <>
                              <LockIcon className="h-4 w-4 mr-1" />
                              Lock
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserMutation.isPending}
                        className="px-3 bg-destructive hover:bg-destructive/90 text-white"
                      >
                        {deleteUserMutation.isPending ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </>
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
