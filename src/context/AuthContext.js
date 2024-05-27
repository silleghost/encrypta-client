import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthTokens } from "../hooks/useAuthTokens";
import { useUser } from "../hooks/useUser";
import {
  userLogin,
  userLogout,
  userRegister,
  updateToken,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useAuthTokens();
  const [user, setUser] = useUser();
  const [loading, setLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    if (loading) {
      updateToken(authTokens, setAuthTokens, setUser, loading, setLoading);
    }

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken(authTokens, setAuthTokens, setUser, loading, setLoading);
      }
    }, 1000 * 60 * 14);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData = {
    user,
    authTokens,
    userLogin: (username, password, totpCode) =>
      userLogin(username, password, totpCode, setAuthTokens, setUser),
    userRegister: (username, email, password) =>
      userRegister(username, email, password, (username, password, totpCode) =>
        userLogin(username, password, totpCode, setAuthTokens, setUser)
      ),
    userLogout: () => userLogout(setAuthTokens, setUser, history),
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
