import React, { useState } from "react";
import MyInput from "./UI/input/MyInput";
import MyButton from "./UI/button/MyButton";
import "../pages/LoginPage.css";

const TotpInput = ({ onSubmit }) => {
  const [totpCode, setTotpCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(totpCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <MyInput
          type="text"
          name="totp"
          placeholder="Введите одноразовый код"
          onChange={(e) => setTotpCode(e.target.value)}
        ></MyInput>
      </div>
      <div className="form-group">
        <MyButton type="submit">Отправить</MyButton>
      </div>
    </form>
  );
};

export default TotpInput;
