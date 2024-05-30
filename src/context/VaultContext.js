import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRecords } from "../services/vaultService";

export const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userLogout } = useContext(AuthContext);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await getRecords();
      setRecords(response.data);
    } catch (error) {
      if (error.message === "Неавторизован") {
        userLogout();
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const contextData = { records, setRecords, isLoading, error };

  return (
    <VaultContext.Provider value={contextData}>
      {children}
    </VaultContext.Provider>
  );
};
