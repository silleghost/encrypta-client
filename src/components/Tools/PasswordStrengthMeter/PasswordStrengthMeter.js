import React, { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ value }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (value) {
      const result = zxcvbn(value);
      setStrength(result.score);
    }
  }, [value]);

  const getStrengthBarStyle = () => {
    const colors = ["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00"];
    const widths = ["10%", "30%", "50%", "80%", "100%"];

    return {
      backgroundColor: colors[strength],
      width: widths[strength],
      height: "5px",
      transition: "width 0.3s ease-in-out",
    };
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
    <>
      <div style={{ backgroundColor: "#ddd", width: "100%", height: "5px" }}>
        <div style={getStrengthBarStyle()} />
      </div>
      <div>Сила пароля: {getStrengthText()}</div>
    </>
  );
};

export default PasswordStrengthMeter;
