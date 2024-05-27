import React, { createContext, useState } from "react";

export const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [records, setRecords] = useState([]);

  const contextData = { records, setRecords };

  return (
    <VaultContext.Provider value={contextData}>
      {children}
    </VaultContext.Provider>
  );
};
