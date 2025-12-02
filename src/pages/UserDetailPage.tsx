import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Mail, Shield, CheckCircle2, XCircle, Lock, UserIcon, Activity, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/role.enum";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-purple-600" />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading user profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">User Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
          The user profile you are looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Navigation */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm font-medium text-slate-500">User Profile</span>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
        {/* Cover Background */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-slate-400 dark:text-slate-300">
                  {(user.name || user.firstName || "?").charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${user.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-2 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {user.name || user.firstName || "Unnamed User"}
                    {user.role === Role.ADMIN && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                        <Shield className="w-3 h-3 mr-1" /> Admin
                      </Badge>
                    )}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Mail className="w-4 h-4" /> {user.email}
                    </span>
                    <span className="hidden md:flex items-center gap-1.5 text-sm">
                      <MapPin className="w-4 h-4" /> San Francisco, CA
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="shadow-sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-lg">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="w-5 h-5 text-purple-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <p className="font-medium text-slate-900 dark:text-white text-lg">{user.name || user.firstName || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <p className="font-medium text-slate-900 dark:text-white text-lg">{user.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
                <p className="font-medium text-slate-900 dark:text-white text-lg capitalize">{(user.role ? String(user.role).toLowerCase() : "user")}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</label>
                <p className="font-mono text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 shadow-sm z-10"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="font-medium text-slate-900 dark:text-white">Updated profile information</p>
                      <span className="text-xs text-slate-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Changed email address from old@example.com</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Meta */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-emerald-500" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${user.isActive !== false ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {user.isActive !== false ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Status</p>
                    <p className={`text-xs ${user.isActive !== false ? 'text-emerald-600' : 'text-red-600'}`}>
                      {user.isActive !== false ? 'Active' : 'Locked'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">Change</Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.isVerified ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                      {user.isVerified ? <Shield className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">Verification</p>
                      <p className={`text-xs ${user.isVerified ? 'text-blue-600' : 'text-amber-600'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                  </div>
                <Button variant="ghost" size="sm" className="text-xs">Resend</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Clock className="w-5 h-5 text-purple-400" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Joined</span>
                <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Last Login</span>
                <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">Just now</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Last Updated</span>
                <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">2 days ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
