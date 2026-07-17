import { Outlet } from "react-router-dom";
import { useGetProfileQuery } from "../store/features/auth/authApi";

export default function AuthInitializer() {
  const { isLoading } = useGetProfileQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}