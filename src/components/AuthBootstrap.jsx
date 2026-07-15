import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  initializeComplete,
  selectInitialized,
  setCredentials,
} from "../store/features/auth/authSlice";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  const initialized = useSelector(selectInitialized);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized) {
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          const json = await response.json();

          dispatch(
            setCredentials({
              accessToken: json.data.accessToken,
              user: json.data.user,
            })
          );
        } else {
          dispatch(initializeComplete());
        }
      } catch {
        dispatch(initializeComplete());
      }

      setLoading(false);
    };

    restoreSession();
  }, [dispatch, initialized]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading session...
      </div>
    );
  }

  return children;
};

export default AuthBootstrap;