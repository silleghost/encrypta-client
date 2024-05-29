import React, { useState } from "react";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import "../pages/LoginPage.css";

const TotpInputForm = ({ onSubmit }) => {
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

export default TotpInputForm;
