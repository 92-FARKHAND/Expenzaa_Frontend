import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectRefreshFailed,
} from "../store/features/auth/authSlice.js";

import { useRefreshMutation } from "../store/features/auth/authApi.js";


const AuthInitializer = () => {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const refreshFailed = useSelector(selectRefreshFailed);


  const [refresh] = useRefreshMutation();



  useEffect(() => {

    // only attempt refresh during initial app boot
    if (
      isLoading &&
      !isAuthenticated &&
      !refreshFailed
    ) {
      refresh();
    }

  }, [
    isLoading,
    isAuthenticated,
    refreshFailed,
    refresh
  ]);




  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }



  if (refreshFailed) {
    return <Navigate to="/login" replace />;
  }



  return isAuthenticated ? <Outlet /> : null;
};


export default AuthInitializer;