"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "@/services/user"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Save, Edit, User, Mail, Shield, CheckCircle2, Lock } from "lucide-react"
import type { UpdateUserDto, User as UserType } from "@/types/user.types"
import { Badge } from "@/components/ui/badge"

interface ProfileSectionProps {
  currentUser: UserType
}

export default function ProfileSection({ currentUser }: ProfileSectionProps) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (userData: UpdateUserDto) => userService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.setQueryData(["users"], (oldUsers: UserType[] | undefined) => {
        if (!oldUsers) return oldUsers
        return oldUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      })
      setIsEditing(false)
    },
  })

  const handleUpdateProfile = () => {
    if (profileForm.firstName || profileForm.lastName || profileForm.email) {
      const updateData: UpdateUserDto = {}
      if (profileForm.firstName || profileForm.lastName) {
        updateData.name = `${profileForm.firstName} ${profileForm.lastName}`.trim()
      }
      if (profileForm.email) {
        updateData.email = profileForm.email
      }
      updateProfileMutation.mutate(updateData)
    }
  }

  return (
    <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-purple-500" />
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 py-6">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
              <Input
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    firstName: e.target.value,
                  })
                }
                placeholder="Enter your first name"
                className="h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
              <Input
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                placeholder="Enter your last name"
                className="h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
              <Input
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="Enter your email"
                type="email"
                className="h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-800">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase()
                    : (currentUser.name?.charAt(0) || "?").toUpperCase()}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${currentUser.isActive !== false ? "bg-emerald-500" : "bg-red-500"}`}
                ></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "Unnamed User"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-normal"
                  >
                    {currentUser.role || "User"}
                  </Badge>
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {currentUser.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <p className="font-medium text-slate-900 dark:text-white text-lg">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <p className="font-medium text-slate-900 dark:text-white text-lg">{currentUser.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                    <Shield className="w-3 h-3 mr-1" /> {currentUser.role || "Administrator"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`${currentUser.isActive !== false ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"}`}
                  >
                    {currentUser.isActive !== false ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Locked
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4 bg-slate-50/50 dark:bg-slate-900/50">
        {isEditing ? (
          <div className="flex space-x-3 w-full">
            <Button onClick={handleUpdateProfile} disabled={updateProfileMutation.isPending} className="flex-1">
              {updateProfileMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="w-full shadow-sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile Information
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
