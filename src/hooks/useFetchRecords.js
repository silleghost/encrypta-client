import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRecords } from "../services/vaultService";

//Хук для получения записей из базы данных при загрузке страницы
export const useFetchRecords = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
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

  return { isLoading, records, error, fetchRecords };
};
