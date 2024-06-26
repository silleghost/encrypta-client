import React, { useState, useContext, useEffect } from "react";
import "./SendPage.css";
import { BASE_URL, SEND_URL } from "../config";
import { saveObject, getObjects, deleteObject } from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import { aesDecrypt, aesEncrypt } from "../crypto";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { base64ToUint8Array } from "../crypto";

const SendPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Состояние для отслеживания отправки
  const { masterKey, authTokens } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDecryptData = async () => {
      if (id) {
        const encryptionKey = new URLSearchParams(location.search).get("key");
        if (!encryptionKey) {
          console.error("Ключ шифрования не найден.");
          return;
        }

        try {
          const url = `${BASE_URL}${SEND_URL}/${id}`;
          const result = await getObjects(url, masterKey, authTokens.access); // Запрос зашифрованных данных
          const decryptedString = await aesDecrypt(
            result.data.iv,
            result.data.key,
            result.data.encrypted_string,
            base64ToUint8Array(encryptionKey)
          );
          setInputValue(new TextDecoder().decode(decryptedString));

          // Вызов функции deleteObject после получения записи
          await deleteObject(
            url,
            { id: result.data.id },
            masterKey,
            authTokens.access
          );
        } catch (error) {
          console.error("Ошибка при получении или расшифровке данных:", error);
        }
      }
    };

    fetchAndDecryptData();
  }, [id, location.search, masterKey, authTokens.access]);

  const handleSubmit = async () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomId = array[0].toString(36);

    const object = { record_id: randomId, encrypted_string: inputValue };
    const url = BASE_URL + SEND_URL;

    try {
      const { encryptedData, encryptedKey, iv } = await aesEncrypt(
        new TextEncoder().encode(inputValue), // Подготовка данных для шифрования
        base64ToUint8Array(masterKey) // Преобразование мастер-ключа
      );

      const encryptedObject = {
        record_id: randomId,
        encrypted_string: encryptedData,
        key: encryptedKey,
        iv: iv,
      };

      const result = await saveObject(
        url,
        encryptedObject,
        masterKey,
        authTokens.access
      );

      // Генерация ссылки с ID записи и ключом шифрования
      const link = `${window.location.origin}${SEND_URL}/${randomId}?key=${btoa(
        String.fromCharCode(...new Uint8Array(encryptedKey))
      )}`;

      navigator.clipboard.writeText(link).then(() => {
        console.log("Ссылка скопирована в буфер обмена.");
        setIsSubmitted(true); // Обновление состояния после копирования
      });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="data-receiver-container">
      {isSubmitted ? (
        <div className="success-message">
          <h2>Данные успешно отправлены!</h2>
          <p>
            Ссылка для доступа к данным скопирована в буфер обмена. Вы можете
            поделиться ею с другими.
          </p>
        </div>
      ) : (
        <>
          <h3>Обмен зашифрованных данных</h3>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Введите данные"
            className="data-receiver-content"
          />
          <button onClick={handleSubmit} className="data-receiver-content">
            Отправить
          </button>
        </>
      )}
    </div>
  );
};

export default SendPage;
