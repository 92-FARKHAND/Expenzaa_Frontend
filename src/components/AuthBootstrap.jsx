import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  initializeComplete,
} from "../store/features/auth/authSlice";


const AuthBootstrap = ({ children }) => {

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(
      initializeComplete()
    );

  }, [dispatch]);


  return children;

};


export default AuthBootstrap;