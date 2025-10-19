import { Routes, Route } from "react-router-dom";
import UserManagement from "./components/UserManagement";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SystemStatus } from "./components/SystemStatus";
import UserDetailPage from "./pages/UserDetailPage";

function App() {
  return (
    <>
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
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
