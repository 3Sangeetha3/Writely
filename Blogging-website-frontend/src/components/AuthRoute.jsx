import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { IS_AUTHENTICATED } from "../constants";
import { useAuth } from "../hooks";

function AuthRoute() {
  const isAuth = useAuth;

  if (!isAuth) return <Navigate to="/" />;
  return <Outlet />;
}

export default AuthRoute;