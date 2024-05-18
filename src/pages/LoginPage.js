import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import TotpInput from "../components/TotpInput";
import "./LoginPage.css";

import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { userLogin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPasword] = useState("");

  const [showTotpInput, setShowTotpInput] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await userLogin(username, password, null);
    } catch (error) {
      if (error.message === "Введите TOTP код") {
        setShowTotpInput(true);
      } else {
        alert("Неправильный логин или пароль");
      }
    }
  };

  const handleTotpSubmit = async (totpCode) => {
    try {
      await userLogin(username, password, totpCode);
      setShowTotpInput(false);
    } catch (error) {
      console.error("Ошибка при отправке TOTP кода", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Вход</h2>
        {showTotpInput ? (
          <TotpInput onSubmit={handleTotpSubmit} />
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <MyInput
                type="text"
                name="username"
                placeholder="Имя пользователя"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <MyInput
                type="password"
                name="password"
                placeholder="Пароль"
                onChange={(e) => setPasword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <MyButton type="submit">Войти</MyButton>
            </div>
          </form>
        )}

        <div className="registration-link-container">
          <Link to="/registration" className="registration-link">
            Регистрация
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
