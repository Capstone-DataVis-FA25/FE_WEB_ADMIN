import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type CreateUserDto } from "../../services/user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export default function UserCreationSection() {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserDto) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setNewUser({ name: "", email: "", password: "" });
    },
    onError: (error: unknown) => {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = apiError.response?.data?.message || "API error";
      }
      alert("Failed to create user: " + errorMessage);
    },
  });

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      createUserMutation.mutate(newUser);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Name
          </label>
          <Input
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
            placeholder="Enter user password"
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
  );
}
