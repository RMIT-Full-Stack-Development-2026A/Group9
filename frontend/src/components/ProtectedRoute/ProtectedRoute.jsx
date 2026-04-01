import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");

  if (!token || !stored) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    try {
      const user = JSON.parse(stored);
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
