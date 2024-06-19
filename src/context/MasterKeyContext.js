import React, { createContext, useContext } from "react";

const MasterKeyContext = createContext(null);

export const MasterKeyProvider = ({ children }) => {
  const [masterKey] = useCryptoKeys();

  return (
    <MasterKeyContext.Provider value={masterKey}>
      {children}
    </MasterKeyContext.Provider>
  );
};

export const useMasterKey = () => useContext(MasterKeyContext);
