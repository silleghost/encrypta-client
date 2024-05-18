import { useState } from "react";

export const useAuthTokens = () => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const setTokens = (data) => {
    localStorage.setItem("authTokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  return [authTokens, setTokens];
};
