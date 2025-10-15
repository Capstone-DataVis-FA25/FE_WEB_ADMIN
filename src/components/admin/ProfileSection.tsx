import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/user";
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
import type { UpdateUserDto, User } from "@/types";

interface ProfileSectionProps {
  currentUser: User;
}

export default function ProfileSection({ currentUser }: ProfileSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: UpdateUserDto) =>
      userService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Update the current user in the users list as well
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      });
      setIsEditing(false);
    },
  });

  const handleUpdateProfile = () => {
    if (profileForm.firstName || profileForm.lastName || profileForm.email) {
      // Create update data with only the fields that have values
      const updateData: UpdateUserDto = {};
      if (profileForm.firstName || profileForm.lastName) {
        updateData.name =
          `${profileForm.firstName} ${profileForm.lastName}`.trim();
      }
      if (profileForm.email) {
        updateData.email = profileForm.email;
      }
      updateProfileMutation.mutate(updateData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <Input
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, firstName: e.target.value })
                }
                placeholder="Enter your first name"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <Input
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, lastName: e.target.value })
                }
                placeholder="Enter your last name"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                placeholder="Enter your email"
                type="email"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 pb-4 border-b dark:border-gray-700">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-semibold text-xl">
                {currentUser.firstName && currentUser.lastName
                  ? `${currentUser.firstName.charAt(
                      0
                    )}${currentUser.lastName.charAt(0)}`.toUpperCase()
                  : (currentUser.name?.charAt(0) || "?").toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "Unnamed User"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User ID: {currentUser.id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                  Name
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "—"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {currentUser.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                  User ID
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {currentUser.id}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                  Role
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  Administrator
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Profile
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
