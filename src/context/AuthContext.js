import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import TOTPInput from "../components/TOTPInput";
//

import argon2 from "argon2-browser";

const generateEncryptedKey = async (username, password) => {
  const encoder = new TextEncoder();
  const salt = "salt";
  const masterKey = await argon2.hash({
    pass: "password",
    salt: "salt",
    time: 3,
    mem: 65536,
    hashLen: 32,
    parallelism: 4,
    type: argon2.ArgonType.Argon2id,
  });

  const encryptionKey = window.crypto.getRandomValues(new Uint8Array(32));

  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(masterKey.slice(0, 32)),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"],
  );

  const encryptedKey = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encryptionKey,
  );

  const encryptedKeyString = Array.from(new Uint8Array(encryptedKey))
    .concat(Array.from(iv))
    .join("$");

  return new Uint8Array(encryptedKeyString);
};

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthToken] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null,
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null,
  );
  let [loading, setLoading] = useState(true);

  let history = useNavigate();

  let userRegister = async (e, username, email, password) => {
    if (e !== null) {
      e.preventDefault();
    }

    const encryptionKey = generateEncryptedKey(username, password);
    console.log(encryptionKey);

    let requestBody = {
      username: username || (e ? e.target.username.value : ""),
      password: password || (e ? e.target.password.value : ""),
      email: email || (e ? e.target.email.value : ""),
    };

    console.log(requestBody);
    // console.log("password is", e.target.password.value);
    // console.log(
    //   "key is",
    //   generateEncryptedKey(e.target.username.value, e.target.password.value),
    // );
    let response = await fetch("http://localhost:8000/user/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    if (response.status === 201) {
      userLogin(e, username, password, null);
    } else {
      alert("Неудачная регистрация");
    }
  };

  let userLogin = async (e, username, password, totpCode) => {
    if (e !== null) {
      e.preventDefault();
    }
    let requestBody = {
      username: username || (e ? e.target.username.value : ""),
      password: password || (e ? e.target.password.value : ""),
      totp_code: totpCode,
    };

    console.log(requestBody);

    let response = await fetch("http://localhost:8000/user/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    let data = await response.json();

    if (response.status === 200) {
      setAuthToken(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    }

    return { status: response.status, data };
  };

  let userLogout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history("/login");
  };

  let updateToken = async () => {
    let response = await fetch(
      "http://localhost:8000/user/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      },
    );

    let data = await response.json();
    if (response.status === 200) {
      setAuthToken(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem("authTokens");
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    userRegister: userRegister,
    userLogin: userLogin,
    userLogout: userLogout,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    let interval = setInterval(
      () => {
        if (authTokens) {
          updateToken();
        }
      },
      1000 * 60 * 14,
    );
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
