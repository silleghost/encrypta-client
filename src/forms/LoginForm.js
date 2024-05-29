import React, { useState } from "react";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";

const LoginForm = ({ onLogin, onToggleTotpInput, onError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await onLogin(username, password, null);
    } catch (error) {
      if (error.message === "Введите TOTP код") {
        onToggleTotpInput(true);
      } else {
        onError("Неправильный логин или пароль");
      }
    }
  };

  return (
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
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <MyButton type="submit">Войти</MyButton>
      </div>
    </form>
  );
};

export default LoginForm;
