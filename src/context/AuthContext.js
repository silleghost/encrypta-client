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
import { useCryptoKeys } from "../hooks/useKeys";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useAuthTokens();
  const [user, setUser] = useUser();
  const [masterKey, setMasterKey] = useCryptoKeys();
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
      userLogin(
        username,
        password,
        totpCode,
        setAuthTokens,
        setUser,
        setMasterKey
      ),
    userRegister: (username, email, password) =>
      userRegister(
        username,
        email,
        password,
        (username, password, totpCode) =>
          userLogin(
            username,
            password,
            totpCode,
            setAuthTokens,
            setUser,
            setMasterKey
          ),
        setMasterKey
      ),
    userLogout: () => userLogout(setAuthTokens, setUser, setMasterKey),
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
