// AuthBootstrap.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../store/features/auth/authSlice";
import { rawBaseQuery } from "../store/baseApi";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const result = await rawBaseQuery(
        { url: "/user/auth/refresh", method: "POST" },
        { dispatch, getState: () => ({}) },
        {}
      );

      if (result?.data?.data) {
        dispatch(
          setCredentials({
            accessToken: result.data.data.accessToken,
            user: result.data.data.user,
          })
        );
      } else {
        dispatch(logout()); // sets initialized: true, accessToken/user: null
      }
    };

    restoreSession();
  }, [dispatch]);

  return children;
};

export default AuthBootstrap;