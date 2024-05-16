import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const baseVaultUrl = "http://localhost:8000/vault/api/records";

export function useRecordsService() {
  const { authTokens, userLogout } = useContext(AuthContext);

  const getRecords = async () => {
    try {
      const response = await fetch(`${baseVaultUrl}/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        return data;
      } else if (response.statusText === "Unauthorized") {
        userLogout();
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const createRecord = async (newRecord) => {
    try {
      const response = await fetch(`${baseVaultUrl}/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
        body: JSON.stringify(newRecord),
      });
      const data = await response.json();
      if (response.status === 201) {
        return data;
      } else if (response.statusText === "Unauthorized") {
        userLogout();
      }
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const updateRecord = async (editedRecord) => {
    try {
      const response = await fetch(`${baseVaultUrl}/${editedRecord.id}/`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
        body: JSON.stringify(editedRecord),
      });

      const data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        console.log("Error updating record:", data);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      const response = await fetch(`${baseVaultUrl}/${recordId}/`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
      });
      if (response.status === 204) {
        return true;
      } else if (response.statusText === "Unauthorized") {
        userLogout();
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return { getRecords, updateRecord, deleteRecord, createRecord };
}

const baseCategoriesUrl = "http://localhost:8000/vault/api/categories";

export function useCategoriesService() {
  const { authTokens, userLogout } = useContext(AuthContext);

  const getCategories = async () => {
    try {
      const response = await fetch(`${baseCategoriesUrl}/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        return data;
      } else if (response.statusText === "Unauthorized") {
        userLogout();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createCategory = async (newCategory) => {
    try {
      const response = await fetch(`${baseCategoriesUrl}/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (response.status === 201) {
        return data;
      } else if (response.statusText === "Unauthorized") {
        userLogout();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const updateCategory = async (editedCategory) => {
    try {
      const response = await fetch(
        `${baseCategoriesUrl}/${editedCategory.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `JWT ${authTokens.access}`,
          },
          body: JSON.stringify(editedCategory),
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        return data;
      } else {
        console.log("Error updating category:", data);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${baseCategoriesUrl}/${categoryId}/`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${authTokens.access}`,
        },
      });

      if (response.status === 204) {
        return true;
      } else if (response.statusText === "Unauthorized") {
        userLogout();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return { getCategories, createCategory, updateCategory, deleteCategory };
}
