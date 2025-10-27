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
import { Save, Edit } from "lucide-react";
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
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 py-5">
        {isEditing ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
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
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Last Name
                </label>
                <Input
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, lastName: e.target.value })
                  }
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Email
                </label>
                <Input
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 pb-4">
              <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full w-16 h-16 flex items-center justify-center text-primary font-semibold text-xl border-2 border-primary/30">
                {currentUser.firstName && currentUser.lastName
                  ? `${currentUser.firstName.charAt(
                      0
                    )}${currentUser.lastName.charAt(0)}`.toUpperCase()
                  : (currentUser.name?.charAt(0) || "?").toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "Unnamed User"}
                </h3>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Name
                </label>
                <div className="p-3 bg-muted rounded-lg">
                  {currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.name || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Email
                </label>
                <div className="p-3 bg-muted rounded-lg">
                  {currentUser.email}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Role
                </label>
                <div className="p-3 bg-muted rounded-lg">Administrator</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
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
