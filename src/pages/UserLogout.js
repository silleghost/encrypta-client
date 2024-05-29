import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserLogout = () => {
  const { userLogout } = useContext(AuthContext);
  return <div>{userLogout()}</div>;
};

export default UserLogout;
