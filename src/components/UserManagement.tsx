import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, type User } from "../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => apiService.getUsers(),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: Omit<User, "id">) => apiService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setNewUser({ name: "", email: "" });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      apiService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleCreateUser = () => {
    if (newUser.name && newUser.email) {
      createUserMutation.mutate(newUser);
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

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
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
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Enter user email"
              type="email"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateUser}
            disabled={
              createUserMutation.isPending || !newUser.name || !newUser.email
            }
          >
            {createUserMutation.isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {users?.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : (
            <div className="space-y-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  {editingUser?.id === user.id ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Name"
                      />
                      <Input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        placeholder="Email"
                        type="email"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
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
  );
}
