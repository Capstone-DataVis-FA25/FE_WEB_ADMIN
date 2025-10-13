import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import type { ChangePasswordDto } from "@/types";

export default function ChangePasswordSection() {
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: ChangePasswordDto) =>
      userService.changePassword(passwordData),
    onSuccess: () => {
      setChangePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      alert("Password changed successfully!");
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
      alert("Failed to change password: " + errorMessage);
    },
  });

  const handleChangePassword = () => {
    if (
      changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword
    ) {
      alert("New passwords do not match!");
      return;
    }

    if (changePasswordForm.currentPassword && changePasswordForm.newPassword) {
      changePasswordMutation.mutate({
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Current Password
          </label>
          <Input
            type="password"
            value={changePasswordForm.currentPassword}
            onChange={(e) =>
              setChangePasswordForm({
                ...changePasswordForm,
                currentPassword: e.target.value,
              })
            }
            placeholder="Enter current password"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <Input
            type="password"
            value={changePasswordForm.newPassword}
            onChange={(e) =>
              setChangePasswordForm({
                ...changePasswordForm,
                newPassword: e.target.value,
              })
            }
            placeholder="Enter new password"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <Input
            type="password"
            value={changePasswordForm.confirmNewPassword}
            onChange={(e) =>
              setChangePasswordForm({
                ...changePasswordForm,
                confirmNewPassword: e.target.value,
              })
            }
            placeholder="Confirm new password"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleChangePassword}
          disabled={
            changePasswordMutation.isPending ||
            !changePasswordForm.currentPassword ||
            !changePasswordForm.newPassword ||
            !changePasswordForm.confirmNewPassword
          }
          className="w-full"
        >
          {changePasswordMutation.isPending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Changing...
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Change Password
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
