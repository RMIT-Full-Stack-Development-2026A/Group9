
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "../shared/ui/ProtectedRoute.jsx";
import Navbar from "../shared/ui/Navbar/Navbar.jsx";

import AdminDashboard from "../modules/admin/components/AdminDashboard/AdminDashboard.jsx";
import GameArena from "../modules/game/pages/GameLobby.jsx";
import LocalGameArena from "../modules/game/pages/LocalGameArena.jsx";
import Home from "../modules/home/pages/Home.jsx";
import AIGameArena from "../modules/game/pages/AIGameArena.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import Payment from "../modules/payment/pages/Payment.jsx";
import Profile from "../modules/profile/pages/Profile.jsx";
import Registration from "../modules/auth/pages/Registration.jsx";

import { useContext } from "react";
import { AuthContext } from "../app/providers/AuthProvider.jsx";

function AppLayout() {
  const { user } = useContext(AuthContext) || {};
  // If admin, block rendering of non-admin layout
  if (user && user.role === "admin") {
    window.history.replaceState(null, "", "/admin");
    return <Navigate to="/admin" replace />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function Router() {
  return (
    <Routes>
      {/* Player/User routes use AppLayout (with Navbar) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/local-arena" element={<LocalGameArenaWrapper />} />
        <Route path="/ai-arena" element={<AIGameArenaWrapper />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Admin routes use AdminDashboard as layout (NO Navbar) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        {/* Example nested admin routes: */}
        {/* <Route path="users" element={<AdminUsers />} /> */}
        {/* <Route path="settings" element={<AdminSettings />} /> */}
      </Route>
    </Routes>
  );
}

// Wrapper to extract settings from location.state
function LocalGameArenaWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings;
  if (!settings) {
    // If no settings, redirect to home
    navigate("/", { replace: true });
    return null;
  }
  return (
    <LocalGameArena
      settings={settings}
      onAbort={() => navigate("/", { replace: true })}
    />
  );
}

function AIGameArenaWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings;
  if (!settings) {
    navigate("/", { replace: true });
    return null;
  }
  return (
    <AIGameArena
      settings={settings}
      onAbort={() => navigate("/", { replace: true })}
    />
  );
}

export default Router;
