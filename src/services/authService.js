import { jwtDecode } from "jwt-decode";
import { deriveKey, derivePassword } from "../crypto";
import {
  BASE_URL,
  LOGIN_URL,
  REGISTER_URL,
  REFRESH_TOKEN_URL,
} from "../config";

//Функция регистрации
export const userRegister = async (
  username,
  email,
  password,
  userLogin,
  setCryptoKeys
) => {
  const masterKey = await deriveKey(password, username);
  const masterPassword = await derivePassword(password, username);

  let requestBody = {
    username: username,
    password: masterPassword,
    email: email,
  };

  let response = await fetch(BASE_URL + REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  let data = await response.json();

  if (response.status === 201) {
    let keyStr = btoa(
      String.fromCharCode.apply(null, new Uint8Array(masterKey))
    );
    localStorage.setItem("masterKey", keyStr);
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
  setKeys
) => {
  const masterPassword = await derivePassword(password, username);

  let requestBody = {
    username: username,
    password: masterPassword,
    totp_code: totpCode,
  };

  let response = await fetch(BASE_URL + LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  let data = await response.json();

  if (response.status === 200) {
    const masterKey = await deriveKey(password, username);
    let keyStr = btoa(
      String.fromCharCode.apply(null, new Uint8Array(masterKey))
    );
    localStorage.setItem("masterKey", keyStr);
    setAuthTokens(data);
    setUser(data);
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
export const userLogout = (setAuthTokens, setUser, history) => {
  setAuthTokens(null);
  setUser(null);
};
