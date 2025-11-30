import { useLazyGetProfileQuery } from "../store/features/auth/authApi.js";
import { useState, useEffect } from "react";
import NotFoundPage from "../pages/public/NotFound.jsx"; // your 404 component

const AuthInitializer = ({ children }) => {
  const [triggerProfile, { isLoading, isError }] = useLazyGetProfileQuery();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await triggerProfile().unwrap(); // tries to fetch profile using cookie
      } catch (_) {
        // do nothing, just mark auth as failed
      } finally {
        setCheckedAuth(true);
      }
    };

    checkAuth();
  }, [triggerProfile]);

  if (!checkedAuth || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  if (isError) {
    return <NotFoundPage />; // show 404 page if session is invalid
  }

  return children; // render children if authenticated
};

export default AuthInitializer;
