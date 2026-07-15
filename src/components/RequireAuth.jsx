import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectInitialized,
} from "../store/features/auth/authSlice";


const RequireAuth = () => {

  const location = useLocation();


  const authenticated =
    useSelector(selectIsAuthenticated);


  const initialized =
    useSelector(selectInitialized);



  if (!initialized) {

    return (
      <div className="
        h-screen
        flex
        items-center
        justify-center
        text-white
      ">
        Checking authentication...
      </div>
    );

  }



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