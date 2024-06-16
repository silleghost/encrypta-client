import { aesEncrypt, aesDecrypt } from "../crypto";
import { encryptDataToString, decryptStringToData } from "./vaultService";
import { BASE_URL, AUDIT_URL } from "../config";

const getAuthHeader = () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  return { Authorization: `JWT ${authTokens.access}` };
};

async function sendToDatabase(data) {
  const authHeader = getAuthHeader();
  const url = BASE_URL + AUDIT_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Ошибка при отправке данных аудита");
  }

  return await response.json();
}

export const getAuditRecords = async () => {
  const authHeader = getAuthHeader();
  const url = BASE_URL + AUDIT_URL;
  const decoder = new TextDecoder("utf-8");

  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  if (response.status === 200) {
    const encryptedRecords = await response.json();
    const decryptedRecords = [];

    for (const encryptedRecord of encryptedRecords) {
      const decryptedRecord = {};
      for (const [key, value] of Object.entries(encryptedRecord)) {
        if (key === "id" || key === "creation_date" || value === null) {
          decryptedRecord[key] = value;
          continue;
        }
        const {
          iv,
          key: encryptedKey,
          data: encryptedData,
        } = decryptStringToData(value);
        const decryptedData = await aesDecrypt(
          iv,
          encryptedKey,
          encryptedData,
          masterKeyArray
        );
        const decryptedValueString = decoder.decode(decryptedData);
        decryptedRecord[key] = JSON.parse(decryptedValueString);
      }
      decryptedRecords.push(decryptedRecord);
    }

    return decryptedRecords;
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении записей аудита");
  }
};

export async function logAuditEvent(event) {
  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const encryptedEvent = {};
  for (const [key, value] of Object.entries(event)) {
    const encoder = new TextEncoder();
    const encodedValue = encoder.encode(JSON.stringify(value));
    const encryptedField = await aesEncrypt(encodedValue, masterKeyArray);
    encryptedEvent[key] = encryptDataToString(
      encryptedField.iv,
      encryptedField.encryptedKey,
      encryptedField.encryptedData
    );
  }
  await sendToDatabase(encryptedEvent);
}
