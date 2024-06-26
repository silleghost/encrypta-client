import {
  deriveKey,
  derivePassword,
  generateSalt,
  stringToUint8Array,
} from "../crypto";
import {
  BASE_URL,
  LOGIN_URL,
  REGISTER_URL,
  REFRESH_TOKEN_URL,
} from "../config";
import { logAuditEvent } from "./auditService";
import { apiRequest } from "./apiService";

//Функция регистрации
export const userRegister = async (username, email, password, userLogin) => {
  const { hashString: hashedUsername, hashArray: saltArray } =
    await generateSalt(username);
  const passwordArray = stringToUint8Array(password);
  const masterPassword = await derivePassword(passwordArray, saltArray);

  let requestBody = {
    username: hashedUsername,
    password: masterPassword,
    email: email,
  };

  const response = await apiRequest(
    BASE_URL + REGISTER_URL,
    "POST",
    requestBody,
    null
  );
  const data = await response.json();

  if (response.status === 201) {
    userLogin(username, password, null);
  } else {
    throw new Error("Неудачная регистрация");
  }
};

//Функция логина
export const userLogin = async (
  username,
  password,
  totpCode,
  setAuthTokens,
  setUser,
  setMasterKey
) => {
  const { hashString: hashedUsername, hashArray: saltArray } =
    await generateSalt(username);
  const passwordArray = stringToUint8Array(password);
  const masterPassword = await derivePassword(passwordArray, saltArray);

  let requestBody = {
    username: hashedUsername,
    password: masterPassword,
    totp_code: totpCode,
  };

  const response = await apiRequest(
    BASE_URL + LOGIN_URL,
    "POST",
    requestBody,
    null
  );
  const data = await response.json();

  if (response.status === 200) {
    const masterKey = await deriveKey(passwordArray, saltArray);
    const exportedKey = await window.crypto.subtle.exportKey("raw", masterKey);
    const keyAsString = btoa(
      String.fromCharCode(...new Uint8Array(exportedKey))
    );
    setMasterKey(keyAsString);
    setAuthTokens(data);
    setUser(data);
    logAuditEvent(
      JSON.stringify({
        action: "Выполнен вход",
        details: username,
      }),
      keyAsString,
      data.access
    );
    return { status: response.status, data };
  } else if (response.status === 401 && data.message === "Введите TOTP код") {
    throw new Error("Введите TOTP код");
  } else {
    throw new Error("Неправильный логин или пароль");
  }
};

//Функция обновления токена
export const updateToken = async (
  authTokens,
  setAuthTokens,
  setUser,
  loading,
  setLoading
) => {
  try {
    let response = await fetch(BASE_URL + REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    let data = await response.json();

    if (response.ok) {
      setAuthTokens(data);
      setUser(data);
      setLoading(false);
    } else {
      setAuthTokens(null);
      setUser(null);
      setLoading(false);
    }
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    setAuthTokens(null);
    setUser(null);
    setLoading(false);
  }
};

//Функция выхода пользователя
export const userLogout = (setAuthTokens, setUser) => {
  setAuthTokens(null);
  setUser(null);
};
