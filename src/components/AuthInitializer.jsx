import { Outlet } from "react-router-dom";
import { useGetProfileQuery } from "../store/features/auth/authApi";
import Loader from "../components/Loader.jsx"

export default function AuthInitializer() {
  const { isLoading } = useGetProfileQuery();

  if (isLoading) {
    return <Loader/>;
  }

  return <Outlet />;
}