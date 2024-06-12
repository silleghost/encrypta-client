import { useState } from "react";
import { deriveKey } from "../crypto";

export const useCryptoKeys = () => {
  const [masterKey, setMasterKey] = useState(() => {
    const key = localStorage.getItem("masterKey");
    return key ? JSON.parse(key) : null;
  });

  const setKeys = async (password, salt) => {
    const key = await deriveKey(password, salt);
    localStorage.setItem("masterKey", JSON.stringify(key));
    setMasterKey(key);
  };

  return [masterKey, setKeys];
};
