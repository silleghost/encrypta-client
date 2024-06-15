import React, { useContext } from "react";
import { VaultContext } from "../../../context/VaultContext";
import zxcvbn from "zxcvbn";
import "./SecurityAnalysis.css"; // Импорт стилей

const analyzePasswords = (records) => {
  const passwordStrengths = records
    .map((record) => ({
      id: record.id,
      app_name: record.app_name,
      strength: zxcvbn(record.password).score,
    }))
    .filter((item) => item.strength < 3); // Фильтрация слабых паролей

  const repeatedPasswords = findRepeatedPasswords(records);

  return { passwordStrengths, repeatedPasswords };
};

const findRepeatedPasswords = (records) => {
  const passwordCounts = {};
  records.forEach((record) => {
    if (passwordCounts[record.password]) {
      passwordCounts[record.password].push(record);
    } else {
      passwordCounts[record.password] = [record];
    }
  });
  return Object.values(passwordCounts).filter((group) => group.length > 1);
};

const findRecordsWithoutTotp = (records) => {
  return records.filter((record) => !record.totp_secret);
};

const strengthText = (score) => {
  switch (score) {
    case 0:
    case 1:
      return "Очень слабый";
    case 2:
      return "Слабый";
    default:
      return "Неизвестно";
  }
};

const SecurityAnalysis = () => {
  const { records } = useContext(VaultContext);
  const { passwordStrengths, repeatedPasswords } = analyzePasswords(records);
  const recordsWithoutTotp = findRecordsWithoutTotp(records);

  return (
    <div className="security-analysis-container">
      <h2 className="security-analysis-title">Анализ безопасности</h2>
      <div className="security-analysis-section">
        <h3 className="security-analysis-subtitle">Слабые пароли:</h3>
        {passwordStrengths.length > 0 ? (
          passwordStrengths.map((item) => (
            <div key={item.id} className="password-strength-item">
              Приложение: {item.app_name}, Надежность:{" "}
              {strengthText(item.strength)}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                title="Рекомендуется изменить пароль на более сильный. Используйте комбинацию букв, цифр и специальных символов."
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
          ))
        ) : (
          <div className="password-strength-item">Слабых паролей нет.</div>
        )}
      </div>
      <div className="security-analysis-section">
        <h3 className="security-analysis-subtitle">Повторяющиеся пароли:</h3>
        {repeatedPasswords.length > 0 ? (
          repeatedPasswords.map((group, index) => (
            <div key={index} className="repeated-passwords-group">
              <h4>Совпадение {index + 1}:</h4>
              {group.map((record) => (
                <div key={record.id} className="repeated-passwords-item">
                  Приложение: {record.app_name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    title="Рекомендуется не использовать одинаковые пароли в этих сервисах."
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="repeated-passwords-item">
            Повторяющихся паролей нет.
          </div>
        )}
      </div>
      <div className="security-analysis-section">
        <h3 className="security-analysis-subtitle">
          Записи без двухфакторной аутентификации:
        </h3>
        {recordsWithoutTotp.length > 0 ? (
          recordsWithoutTotp.map((record) => (
            <div key={record.id} className="totp-missing-item">
              Приложение: {record.app_name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                title="Рекомендуется включить двухфакторную аутентификацию."
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
          ))
        ) : (
          <div className="totp-missing-item">
            Все записи защищены двухфакторной аутентификацией.
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityAnalysis;
