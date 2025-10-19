import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, User as UserIcon, AlertCircle } from "lucide-react";
import type { User } from "@/types";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

  const handleBack = () => {
    navigate("/users");
  };

  if (!id) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  User Details
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="p-3 rounded-full bg-destructive/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Invalid Request
                </h3>
                <p className="text-muted-foreground">
                  User ID is required to view user details
                </p>
                <div className="mt-6">
                  <Button onClick={handleBack}>Back to Users</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  User Details
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <Spinner size="lg" />
                  <p className="text-muted-foreground">
                    Loading user details...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  User Details
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Error Loading User</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load user details"}
                </AlertDescription>
                <div className="mt-4">
                  <Button onClick={handleBack}>Back to Users</Button>
                </div>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  User Details
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="p-3 rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  User Not Found
                </h3>
                <p className="text-muted-foreground">
                  The requested user could not be found
                </p>
                <div className="mt-6">
                  <Button onClick={handleBack}>Back to Users</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg rounded-xl border">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold">
                User Details
              </CardTitle>
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 border shadow-sm">
                  <div className="text-center">
                    <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/40 rounded-full w-24 h-24 flex items-center justify-center text-primary font-semibold text-2xl mb-4 border-2 border-primary/30">
                      {(user.name || user.firstName || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {user.name || user.firstName || "Unnamed User"}
                    </h2>
                    <p className="text-muted-foreground mb-4">{user.email}</p>

                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {user.role || "USER"}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex justify-between">
                        <span>User ID:</span>
                        <span className="font-mono">{user.id}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Account Type:</span>
                        <span>
                          {user.isSocialAccount
                            ? "Social Account"
                            : "Regular Account"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl p-6 border shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          First Name
                        </p>
                        <p className="font-medium text-foreground">
                          {user.firstName || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Email
                        </p>
                        <p className="font-medium text-foreground break-all">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Last Name
                        </p>
                        <p className="font-medium text-foreground">
                          {user.lastName || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Role
                        </p>
                        <p className="font-medium text-foreground">
                          {user.role || "USER"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                    Account Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Account Status
                        </p>
                        <p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Email Verification
                        </p>
                        <p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.isVerified
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {user.isVerified ? "Verified" : "Not Verified"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Account Type
                        </p>
                        <p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.isSocialAccount
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {user.isSocialAccount
                              ? "Social Account"
                              : "Regular Account"}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Created At
                        </p>
                        <p className="font-medium text-foreground">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {user.updatedAt && (
                  <div className="bg-card rounded-xl p-6 border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                      Activity
                    </h3>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Last Updated
                      </p>
                      <p className="font-medium text-foreground">
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
