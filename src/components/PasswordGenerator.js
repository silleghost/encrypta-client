import React, { useState } from "react";

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generatePassword = () => {
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
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      password += allowedChars[randomIndex];
    }

    setGeneratedPassword(password);
  };

  return (
    <div>
      <h2>Генератор паролей</h2>
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
      <button onClick={generatePassword}>Сгенерировать пароль</button>
      <div>
        <label>Сгенерированный пароль:</label>
        <input type="text" value={generatedPassword} readOnly />
      </div>
    </div>
  );
};

export default PasswordGenerator;
