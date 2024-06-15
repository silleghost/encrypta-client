import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRecords, getCategories } from "../services/vaultService";

export const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState(null);

  const { userLogout } = useContext(AuthContext);

  const fetchRecords = async () => {
    const response = await getRecords();
    try {
      setIsLoadingRecords(true);
      // const response = await getRecords();
      setRecords(response.data);
    } catch (error) {
      if (error.message === "Неавторизован") {
        userLogout();
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      if (error.message === "Неавторизован") {
        userLogout();
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchCategories();
  }, []);

  const contextData = {
    records,
    setRecords,
    categories,
    setCategories,
    isLoadingRecords,
    isLoadingCategories,
    error,
  };

  return (
    <VaultContext.Provider value={contextData}>
      {children}
    </VaultContext.Provider>
  );
};
