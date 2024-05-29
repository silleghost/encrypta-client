import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./RegistrationPage.css";
import { AuthContext } from "../context/AuthContext";
import RegistrationForm from "../forms/RegistrationForm";
import ErrorNotification from "../components/UI/notification/ErrorNotification";

const RegistrationPage = () => {
  const { userRegister } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegistration = async (username, email, password) => {
    try {
      await userRegister(username, email, password);
      navigate("/vault");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2 className="registration-title">Регистрация</h2>
        <ErrorNotification
          error={error}
          onClose={handleCloseError}
          autoCloseDelay={3000}
        />
        <RegistrationForm
          onRegistration={handleRegistration}
          onError={handleError}
        />
        <div className="login-link-container">
          <Link to="/login" className="login-link">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
