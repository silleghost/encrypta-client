import React, { useState } from "react";
import MyButton from "../components/UI/button/MyButton";
import MyInput from "../components/UI/input/MyInput";

const RegistrationForm = ({ onRegistration, onError }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPasword1] = useState("");
  const [password2, setPasword2] = useState("");

  const validateForm = () => {
    if (!username || !email || !password1 || !password2) {
      onError("Пожалуйста заполните все поля");
      return false;
    }
    if (password1 !== password2) {
      onError("Пароли не совпадают");
      return false;
    }
    return true;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        onRegistration(username, email, password1);
      } catch (error) {
        onError(error.message);
      }
    }
  };

  return (
    <form
      className="registration-form"
      onSubmit={handleRegistration}
      autoComplete="off"
    >
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
          autoComplete="new-password"
        />
      </div>
      <div className="form-group">
        <MyInput
          type="password"
          name="password2"
          placeholder="Повторите пароль"
          onChange={(e) => setPasword2(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <MyButton type="submit">Регистрация</MyButton>
      </div>
    </form>
  );
};

export default RegistrationForm;
