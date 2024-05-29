import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TotpInput from "../forms/TotpInputForm";
import LoginForm from "../forms/LoginForm";
import "./LoginPage.css";

import { AuthContext } from "../context/AuthContext";
import ErrorNotification from "../components/UI/notification/ErrorNotification";

const LoginPage = () => {
  const { userLogin } = useContext(AuthContext);
  const [showTotpInput, setShowTotpInput] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (username, password, totpCode) => {
    try {
      await userLogin(username, password, totpCode);
      navigate("/vault");
    } catch (error) {
      if (error.message === "Введите TOTP-код") {
        setShowTotpInput(true);
      } else {
        setError("Неправильный логин или пароль");
      }
    }
  };

  const handleTotpSubmit = async (totpCode) => {
    try {
      await userLogin(username, password, totpCode);
      setShowTotpInput(false);
      navigate("/vault");
    } catch (error) {
      if (error.message === "Введите TOTP код") {
        setError("Введите корректный код");
      }
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Вход</h2>
        <ErrorNotification
          error={error}
          onClose={handleCloseError}
          autoCloseDelay={3000}
        />
        {showTotpInput ? (
          <TotpInput onSubmit={handleTotpSubmit} />
        ) : (
          <LoginForm
            onLogin={handleLogin}
            onToggleTotpInput={setShowTotpInput}
            onError={handleError}
          />
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
