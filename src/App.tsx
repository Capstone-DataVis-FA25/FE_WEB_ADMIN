import { Routes, Route } from "react-router-dom";
import UserManagement from "./components/UserManagement";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SystemStatus } from "./components/SystemStatus";
import UserDetailPage from "./pages/UserDetailPage";
import { SubscriptionManagementPage } from "./pages/SubscriptionManagementPage";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import { ToastProvider } from "./components/ui/toast";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  <Route
                    path="/admin/users"
                    element={<AdminUserManagementPage />}
                  />
                  <Route path="/admin/system" element={<SystemStatus />} />
                  <Route path="/admin/subscriptions" element={<SubscriptionManagementPage />} />
                  <Route path="/admin/activity" element={<ActivityFeedPage />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ToastProvider>
  );
}

export default App;
