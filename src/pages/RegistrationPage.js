import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import AuthContext from "../context/AuthContext";

const RegistrationPage = () => {
  let { userRegister } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  return (
    <div>
      <Link to="/login">Login</Link>
      <form onSubmit={(e) => userRegister(e, null, null, password)}>
        <p>
          <input
            type="text"
            name="username"
            placeholder="Введите имя пользователя"
          ></input>
        </p>
        <p>
          <input
            type="email"
            name="email"
            placeholder="Введите электроную почту"
          ></input>
        </p>
        <div>
          {
            <PasswordStrengthMeter
              type="password"
              name="password"
              placeholder="Введите пароль"
              onChange={setPassword}
            />
          }
        </div>
        <input type="submit"></input>
      </form>
    </div>
  );
};

export default RegistrationPage;
