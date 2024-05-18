import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import "./RegistrationPage.css";
import { AuthContext } from "../context/AuthContext";

const RegistrationPage = () => {
  const { userRegister, userLogin } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPasword1] = useState("");
  const [password2, setPasword2] = useState("");

  const validateForm = () => {
    if (!username || !email || !password1 || !password2) {
      alert("Пожалуйста заполните все поля");
      return false;
    }
    if (password1 !== password2) {
      alert("Пароли не совпадают");
      return false;
    }
    return true;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      userRegister(username, email, password1);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2 className="registration-title">Регистрация</h2>
        <form className="registration-form" onSubmit={handleRegistration}>
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
              type="email"
              name="email"
              placeholder="Электронная почта"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <MyInput
              type="password"
              name="password1"
              placeholder="Пароль"
              onChange={(e) => setPasword1(e.target.value)}
            />
          </div>
          <div className="form-group">
            <MyInput
              type="password"
              name="password2"
              placeholder="Повторите пароль"
              onChange={(e) => setPasword2(e.target.value)}
            />
          </div>

          <div className="form-group">
            <MyButton type="submit">Регистрация</MyButton>
          </div>
        </form>
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
