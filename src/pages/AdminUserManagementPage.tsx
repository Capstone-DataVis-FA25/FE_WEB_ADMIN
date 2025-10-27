
import { useQuery } from "@tanstack/react-query"
import { userService } from "../services/user"
import { Spinner } from "../components/ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert"
import { RefreshCw, Shield } from "lucide-react"
import ProfileSection from "@/components/admin/ProfileSection"
import ChangePasswordSection from "@/components/admin/ChangePasswordSection"
import type { User } from "@/types/user.types"

export default function AdminUserManagementPage() {
  const {
    data: currentUser,
    isLoading: currentUserLoading,
    error: currentUserError,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  })

  if (currentUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (currentUserError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card text-card-foreground rounded-lg shadow-sm p-6 border border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Management</h1>
          </div>
          <p className="text-muted-foreground">Manage your admin profile and security settings</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-muted hover:bg-accent rounded-lg text-sm font-medium transition-colors duration-200 border border-border"
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
  )
}
