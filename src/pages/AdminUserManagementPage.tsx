import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user";
import { Spinner } from "../components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import ProfileSection from "../components/admin/ProfileSection";
import ChangePasswordSection from "../components/admin/ChangePasswordSection";
import { RefreshCw } from "lucide-react";
import type { User } from "@/types";

export default function AdminUserManagementPage() {
  const {
    data: currentUser,
    isLoading: currentUserLoading,
    error: currentUserError,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });

  if (currentUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (currentUserError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card text-card-foreground rounded-xl shadow-sm p-6 border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Admin User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage admin users and your profile
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-muted hover:bg-accent rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <div className="flex flex-col space-y-6">
          {currentUser && <ProfileSection currentUser={currentUser} />}
          <ChangePasswordSection />
        </div>
      </div>
    </div>
  );
}
