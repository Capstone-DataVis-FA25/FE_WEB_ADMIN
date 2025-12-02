import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { userService } from "../../services/user"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { Key } from "lucide-react"
import type { ChangePasswordDto } from "@/types/user.types"

export default function ChangePasswordSection() {
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: ChangePasswordDto) => userService.changePassword(passwordData),
    onSuccess: () => {
      setChangePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
      alert("Password changed successfully!")
    },
    onError: (error: unknown) => {
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } }
        }
        errorMessage = apiError.response?.data?.message || "API error"
      }
      alert("Failed to change password: " + errorMessage)
    },
  })

  const handleChangePassword = () => {
    if (changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword) {
      alert("New passwords do not match!")
      return
    }

    if (changePasswordForm.currentPassword && changePasswordForm.newPassword) {
      changePasswordMutation.mutate({
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      })
    }
  }

  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-semibold">Change Password</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 py-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
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
              className="h-10"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
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
              className="h-10"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
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
              className="h-10"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
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
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
