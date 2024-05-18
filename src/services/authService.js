import { jwtDecode } from "jwt-decode";
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
  history
) => {
  let requestBody = {
    username: username,
    password: password,
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

  console.log(response.data);

  if (response.status === 201) {
    userLogin(username, password, null, history);
  } else {
    alert("Неудачная регистрация");
  }
};

//Функция логина
export const userLogin = async (
  username,
  password,
  totpCode,
  setAuthTokens,
  setUser,
  history
) => {
  let requestBody = {
    username: username,
    password: password,
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

  console.log(response.data);

  if (response.status === 200) {
    setAuthTokens(data);
    setUser(data);
    history("/");
  }

  return { status: response.status, data };
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
  history("/login");
};
