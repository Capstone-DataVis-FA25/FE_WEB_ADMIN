import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Eye, Unlock, Trash2, Shield, CheckCircle2, Mail, Search } from 'lucide-react';
import type { User as UserType } from "@/types/user.types";

interface UserListSectionProps {
  users: UserType[];
}

export default function UserListSection({ users }: UserListSectionProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(user => 
    (user.name || user.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const lockUnlockUserMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.lockUnlockUser(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  

  const handleDeleteUser = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleLockUnlockUser = (id: string, isActive: boolean) => {
    lockUnlockUserMutation.mutate({ id, isActive });
  };

  const handleViewUser = (id: string) => {
    navigate(`/users/${id}`);
  };

  

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Users</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your team members and their account permissions here.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredUsers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-full mb-4">
                <User className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">No users found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                We couldn't find any users matching your search. Try adjusting your filters or add a new user.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers?.map((user) => (
                <div
                  key={user.id}
                  className="group p-4 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-300 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                            {(user.name || user.firstName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        </div>

                        {/* User Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer" onClick={() => handleViewUser(user.id)}>
                              {user.name || user.firstName || "Unnamed User"}
                            </h3>
                            {user.role === "ADMIN" && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 text-[10px] px-1.5 py-0 h-5">
                                <Shield className="w-3 h-3 mr-1" /> Admin
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-16 sm:pl-0">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                              <Lock className="w-3 h-3 mr-1" /> Locked
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewUser(user.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {user.role !== "ADMIN" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLockUnlockUser(user.id, !user.isActive)}
                              className={`h-8 w-8 p-0 ${user.isActive ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}
                              title={user.isActive ? "Lock Account" : "Unlock Account"}
                            >
                              {user.isActive ? (
                                <Lock className="h-4 w-4" />
                              ) : (
                                <Unlock className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
