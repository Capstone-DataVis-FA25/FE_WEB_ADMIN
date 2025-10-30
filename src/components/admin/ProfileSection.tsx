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
import { Save, Edit, User } from "lucide-react";
import type { UpdateUserDto, User as UserType } from "@/types/user.types";

interface ProfileSectionProps {
  currentUser: UserType;
}

export default function ProfileSection({ currentUser }: ProfileSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (userData: UpdateUserDto) =>
      userService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.setQueryData(
        ["users"],
        (oldUsers: UserType[] | undefined) => {
          if (!oldUsers) return oldUsers;
          return oldUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          );
        }
      );
      setIsEditing(false);
    },
  });

  const handleUpdateProfile = () => {
    if (profileForm.firstName || profileForm.lastName || profileForm.email) {
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
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            Profile Information
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 py-6">
        {isEditing ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  First Name
                </label>
                <Input
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Enter your first name"
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  Last Name
                </label>
                <Input
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, lastName: e.target.value })
                  }
                  placeholder="Enter your last name"
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  Email
                </label>
                <Input
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  type="email"
                  className="h-10"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 pb-4">
              <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg w-16 h-16 flex items-center justify-center text-primary font-semibold text-xl border border-primary/20">
                {currentUser.firstName && currentUser.lastName
                  ? `${currentUser.firstName.charAt(
                      0
                    )}${currentUser.lastName.charAt(0)}`.toUpperCase()
                  : (currentUser.name?.charAt(0) || "?").toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "Unnamed User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  Name
                </label>
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50 text-sm">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  Email
                </label>
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50 text-sm">
                  {currentUser.email}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  Role
                </label>
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50 text-sm">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        {isEditing ? (
          <div className="flex space-x-2 w-full">
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
              className="flex-1"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
