import { useQuery } from "@tanstack/react-query"
import { userService } from "../services/user"
import { Spinner } from "../components/ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert"
import { RefreshCw, Shield, AlertCircle } from 'lucide-react'
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground font-medium">Loading admin data...</p>
        </div>
      </div>
    )
  }

  if (currentUserError) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8 border-2 rounded-2xl shadow-xl">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription className="mt-2">Failed to load data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-card via-card to-muted/30 text-card-foreground rounded-2xl shadow-xl p-8 border-2 backdrop-blur">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Admin Management
            </h1>
          </div>
          <p className="text-muted-foreground ml-[52px] text-sm">Manage your admin profile and security settings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-muted to-muted/80 hover:from-primary hover:to-primary/90 hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all duration-200 border-2 shadow-md hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 max-w-5xl mx-auto">
        <div className="flex flex-col space-y-8">
          {currentUser && <ProfileSection currentUser={currentUser} />}
          <ChangePasswordSection />
        </div>
      </div>
    </div>
  )
}
