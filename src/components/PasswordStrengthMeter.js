import React, { useState } from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ onChange }) => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    const result = zxcvbn(newPassword);
    setStrength(result.score);

    onChange(newPassword);
  };

  const getStrengthText = () => {
    switch (strength) {
      case 0:
        return "Слабый";
      case 1:
        return "Очень слабый";
      case 2:
        return "Средний";
      case 3:
        return "Сильный";
      case 4:
        return "Очень сильный";
      default:
        return "";
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Введите пароль"
      />
      <div>Сила пароля: {getStrengthText()}</div>
    </div>
  );
};

export default PasswordStrengthMeter;
