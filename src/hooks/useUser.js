import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useUser = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authTokens");
    if (token) {
      try {
        const decodedToken = jwtDecode(JSON.parse(token).access);
        return decodedToken.username || decodedToken.sub || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const setUserData = (data) => {
    if (data) {
      const decodedToken = jwtDecode(data.access);
      setUser(decodedToken.username);
    } else {
      setUser(null);
    }
  };

  return [user, setUserData];
};
