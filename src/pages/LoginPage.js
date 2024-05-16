import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import TOTPInput from "../components/TOTPInput";

const LoginPage = () => {
  const { userLogin } = useContext(AuthContext);
  const [showTOTPInput, setShowTOTPInput] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPasword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const response = await userLogin(e, username, password);

    setUsername(username);
    setPasword(password);

    if (response.status === 401) {
      if (response.data.error === "Введите правильный TOTP код") {
        setShowTOTPInput(true);
      } else {
        alert("Неправильное имя пользователя или пароль");
      }
    }
  };

  return (
    <div>
      <Link to="/registration">Registration</Link>
      <form onSubmit={handleLogin}>
        <p>
          <input
            type="text"
            name="username"
            placeholder="Введите имя пользователя"
          ></input>
        </p>
        <p>
          <input
            type="password"
            name="password"
            placeholder="Введите пароль"
          ></input>
        </p>
        <input type="submit"></input>
      </form>
      {showTOTPInput && <TOTPInput username={username} password={password} />}
    </div>
  );
};

export default LoginPage;
