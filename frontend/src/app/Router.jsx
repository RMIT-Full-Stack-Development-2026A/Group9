/*
  Router.jsx
  Central routing and small layout components for the app.
  - Routes are intentionally shallow: player-facing routes share a common
    layout (`AppLayout`) which includes the `Navbar`. Admin routes mount a
    separate `AdminDashboard` layout that intentionally omits the Navbar.
  - Wrapper components (LocalGameArenaWrapper, AIGameArenaWrapper,
    OnlineGameArenaWrapper) extract navigation state and guard access when
    required (for example, preventing admins from entering player arenas).
*/

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
import LocalGameArena from "../modules/game/pages/LocalGameArena.jsx";
import Home from "../modules/home/pages/Home.jsx";
import AIGameArena from "../modules/game/pages/AIGameArena.jsx";
import GameRoomLobby from "../modules/multiplayer/pages/GameRoomLobby.jsx";
import OnlineGameArena from "../modules/multiplayer/pages/OnlineGameArena.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import Payment from "../modules/payment/pages/Payment.jsx";
import Profile from "../modules/profile/pages/Profile.jsx";
import Registration from "../modules/auth/pages/Registration.jsx";

import { useContext } from "react";
import { AuthContext } from "../app/providers/AuthProvider.jsx";

/*
  AppLayout
  - Shared layout for regular players: renders `Navbar` and an `Outlet`
    for nested routes. This keeps navigation consistent across player pages.
  - If the current user is an admin, we prevent rendering the player
    layout and perform a redirect to the admin dashboard. This ensures the
    admin UI and player UI are isolated and prevents accidental access.
*/
function AppLayout() {
  const { user } = useContext(AuthContext) || {};
  // If admin, block rendering of non-admin layout: replace browser state so
  // the user can't click back to a player route that would show a wrong UI.
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

/*
  Router
  - Declares application routes and which layout they use.
  - Player routes are nested under `AppLayout` so they inherit the Navbar.
  - Admin routes use `ProtectedRoute` with `roles={["admin"]}` to restrict
    access at the route level.
*/
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
        <Route path="/multiplayer" element={<GameRoomLobby />} />
        <Route
          path="/multiplayer/arena/:roomId"
          element={<OnlineGameArenaWrapper />}
        />
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

/*
  LocalGameArenaWrapper
  - Small wrapper used when navigating to the local game arena. It extracts
    the game `settings` from `location.state` (this is commonly set by the
    page that initiates navigation). If settings are missing, it redirects
    the user back to home instead of rendering the arena with undefined
    configuration.
  - Also prevents admins from accidentally opening player arenas.
*/
function LocalGameArenaWrapper() {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings;
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
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

/*
  AIGameArenaWrapper
  - Same rationale as LocalGameArenaWrapper but for AI matches.
  - Ensures the component always receives a valid `settings` prop and that
    admin users are redirected away.
*/
function AIGameArenaWrapper() {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings;
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
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

/*
  OnlineGameArenaWrapper
  - Wrapper used for multiplayer arena route. It validates that `location.state`
    has the necessary context (for example, room metadata) and redirects back
    to the lobby if not present. This avoids rendering an arena without the
    required multiplayer context.
*/
function OnlineGameArenaWrapper() {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (!state) {
    navigate("/multiplayer", { replace: true });
    return null;
  }
  return <OnlineGameArena />;
}

export default Router;
