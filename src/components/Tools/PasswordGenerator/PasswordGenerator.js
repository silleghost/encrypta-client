import React, { useState } from "react";
import "./PasswordGenerator.css";
import CopyButton from "../../UI/button/CopyButton";
import MyInput from "../../UI/input/MyInput";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStrengthMeter";

const PasswordGenerator = ({ embedded, onSelectPassword, onClose }) => {
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = (e) => {
    e.preventDefault();
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let allowedChars = "";
    if (includeUppercase) allowedChars += uppercaseChars;
    if (includeLowercase) allowedChars += lowercaseChars;
    if (includeNumbers) allowedChars += numberChars;
    if (includeSymbols) allowedChars += symbolChars;

    let password = "";
    if (allowedChars === "") {
      password = "Выберите параметры";
    } else {
      for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
      }
    }

    setGeneratedPassword(password);
  };

  return (
    <div className="password-generator">
      <div className="header">
        <h2>Генератор паролей</h2>
        {embedded && (
          <button className="modal-close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="modal-close-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <div>
        <label>Длина пароля:</label>
        <input
          type="range"
          min="6"
          max="20"
          value={passwordLength}
          onChange={(e) => setPasswordLength(e.target.value)}
        />
        <span>{passwordLength}</span>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
          />
          Заглавные латинские буквы
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
          />
          Строчные латинские буквы
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          Числа
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
          Символы
        </label>
      </div>
      <button className="gen-button" onClick={generatePassword}>
        Сгенерировать пароль
      </button>
      {embedded && (
        <button
          className="gen-button"
          onClick={() => onSelectPassword(generatedPassword)}
        >
          Выбрать пароль
        </button>
      )}

      <div>
        <label>Сгенерированный пароль:</label>
        <div className="input-with-copy">
          <MyInput type="text" value={generatedPassword} readOnly />
          <CopyButton value={generatedPassword} />
        </div>
      </div>
      {generatedPassword && <PasswordStrengthMeter value={generatedPassword} />}
    </div>
  );
};

export default PasswordGenerator;
