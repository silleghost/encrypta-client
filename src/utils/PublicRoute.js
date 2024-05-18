import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/404" /> : element;
};

export default PublicRoute;
