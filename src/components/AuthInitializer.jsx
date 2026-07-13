import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectRefreshFailed,
} from "../store/features/auth/authSlice.js";
import { useRefreshMutation } from "../store/features/auth/authApi.js";

const AuthInitializer = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const hasRefreshFailed = useSelector(selectRefreshFailed);

  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      refresh();
    }
  }, []); // runs once on mount

  // ⏳ Covers: initial load + silent refresh in progress
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  // ❌ Refresh token expired or invalid → go to login
  if (hasRefreshFailed) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → render app
  if (isAuthenticated) {
    return children ? children : <Outlet />;
  }

  // ⏳ Fallback: still waiting (shouldn't normally reach here)
  return null;
};
export default AuthInitializer