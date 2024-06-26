import { useState } from "react";

export const useMasterKey = () => {
  const [masterKey, setMasterKey] = useState(() => {
    const tokens = localStorage.getItem("masterKey");
    return tokens ? JSON.parse(tokens) : null;
  });

  const setKey = (data) => {
    localStorage.setItem("masterKey", JSON.stringify(data));
    setMasterKey(data);
  };

  return [masterKey, setKey];
};
