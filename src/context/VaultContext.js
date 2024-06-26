import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useAuthTokens } from "../hooks/useAuthTokens";
import { getObjects } from "../services/apiService";
import { BASE_URL, RECORDS_URL, CATEGORIES_URL, CARDS_URL } from "../config";

export const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [error, setError] = useState(null);

  const { masterKey, userLogout } = useContext(AuthContext);
  const [authTokens] = useAuthTokens();

  const fetchRecords = async () => {
    try {
      setIsLoadingRecords(true);
      const response = await getObjects(
        BASE_URL + RECORDS_URL,
        masterKey,
        authTokens.access
      );
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
      const response = await getObjects(
        BASE_URL + CATEGORIES_URL,
        masterKey,
        authTokens.access
      );
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

  const fetchCards = async () => {
    try {
      setIsLoadingCards(true);
      const response = await getObjects(
        BASE_URL + CARDS_URL,
        masterKey,
        authTokens.access
      );
      setCards(response.data);
    } catch (error) {
      if (error.message === "Неавторизован") {
        userLogout();
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchCategories();
    fetchCards();
  }, []);

  const contextData = {
    records,
    setRecords,
    categories,
    setCategories,
    isLoadingRecords,
    isLoadingCategories,
    isLoadingCards,
    cards,
    setCards,
    error,
  };

  return (
    <VaultContext.Provider value={contextData}>
      {children}
    </VaultContext.Provider>
  );
};
