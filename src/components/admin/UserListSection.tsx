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
  LockIcon,
  Trash2,
  Users,
} from "lucide-react";
import type { UpdateUserDto, User as UserType } from "@/types/user.types";

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

  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

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
    <Card className="shadow-lg rounded-xl border border-border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border pb-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl font-bold">Users List</CardTitle>
          </div>
          <span className="text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground bg-clip-text px-4 py-2 rounded-full font-bold border border-primary/20 shadow-sm">
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
            <p className="text-muted-foreground font-medium">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users?.map((user) => (
              <div
                key={user.id}
                className="p-5 hover:bg-accent/40 transition-all duration-200 hover:shadow-sm"
              >
                {editingUser?.id === user.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-br from-primary to-accent rounded-xl w-14 h-14 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                        {(user.name || user.firstName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">
                          Editing User
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          Update user information
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                          Name
                        </label>
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Name"
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                          Email
                        </label>
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          placeholder="Email"
                          type="email"
                          className="mt-1 h-10"
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
                        <div className="bg-gradient-to-br from-primary to-accent rounded-xl w-12 h-12 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                          {(user.name || user.firstName || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        {user.isActive === false && (
                          <div className="absolute -top-1 -right-1 bg-destructive rounded-full w-6 h-6 flex items-center justify-center border-2 border-background shadow-lg">
                            <Lock className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {user.name || user.firstName || "Unnamed User"}
                          {user.role === "ADMIN" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                              Admin
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email || "No email provided"}
                        </p>
                        <div className="flex items-center mt-1.5 gap-2">
                          {user.isActive === false && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Locked
                            </span>
                          )}
                          {user.isVerified === false && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
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
                        className="px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleViewUser(user.id)}
                        className="px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
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
                          className={`px-4 shadow-lg ${
                            user.isActive === false
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                              : "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white"
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
                        className="px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
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
