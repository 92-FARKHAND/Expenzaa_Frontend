import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
} from "../store/features/auth/authSlice";

const RequireAuth = () => {

  const location = useLocation();

  const authenticated = useSelector(
    selectIsAuthenticated
  );

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default RequireAuth;