import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const { userLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    userLogout();
    navigate("/login");
  }, [userLogout, navigate]);

  return <div>Выход из системы...</div>;
};

export default UserLogout;
