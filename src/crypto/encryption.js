import { BASE_URL, RECORDS_URL, CATEGORIES_URL, CARDS_URL } from "../config";
import {
  aesEncrypt,
  aesDecrypt,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from ".";

export function encryptDataToString(iv, key, data) {
  return `${uint8ArrayToBase64(iv)}$${uint8ArrayToBase64(
    key
  )}$${uint8ArrayToBase64(data)}`;
}

export function decryptStringToData(encryptedString) {
  if (!encryptedString) {
    throw new Error("Зашифрованная строка отсутствует или null");
  }
  const parts = encryptedString.split("$");
  if (parts.length !== 3) {
    throw new Error("Некорректный формат зашифрованной строки");
  }
  return {
    iv: base64ToUint8Array(parts[0]),
    key: base64ToUint8Array(parts[1]),
    data: base64ToUint8Array(parts[2]),
  };
}

export async function encryptItem(item, masterKey) {
  const encryptedItem = {};
  const encoder = new TextEncoder();

  // Шифрование каждого поля отдельно, кроме id
  for (const [key, value] of Object.entries(item)) {
    if (
      key === "id" ||
      key === "category" ||
      key === "lastmodified_date" ||
      key === "creation_date" ||
      key === "favicon"
    )
      continue; // Пропускаем эти поля

    try {
      const fieldValueString = JSON.stringify(value);
      const fieldValueArray = encoder.encode(fieldValueString);
      const encryptedField = await aesEncrypt(fieldValueArray, masterKey);

      // Формирование строки в формате {iv}${key}${data}
      encryptedItem[key] = encryptDataToString(
        encryptedField.iv,
        encryptedField.encryptedKey,
        encryptedField.encryptedData
      );
    } catch (error) {
      console.error(`Ошибка при шифровании ${key}: ${error}`);
    }
  }

  encryptedItem["id"] = item.id;

  if (item.category !== null) {
    encryptedItem["category"] = item.category;
  }

  return encryptedItem;
}

export async function decryptItem(encryptedItem, masterKey) {
  const decryptedItem = {};
  const decoder = new TextDecoder("utf-8");

  for (const [key, value] of Object.entries(encryptedItem)) {
    try {
      if (
        key === "id" ||
        key === "category" ||
        key === "favicon" ||
        key === "creation_date" ||
        key === "lastmodified_date"
      ) {
        decryptedItem[key] = value; // Пропускаем шифрование для id и category
        continue;
      }
      if (value === null) {
        decryptedItem[key] = null; // Передаем null в расшифрованную запись
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
        masterKey
      );
      const decryptedValueString = decoder.decode(decryptedData);
      decryptedItem[key] = JSON.parse(decryptedValueString);
    } catch (error) {
      console.error(`Ошибка при дешифровании ${key}: ${error}`);
    }
  }

  decryptedItem["id"] = encryptedItem.id;

  return decryptedItem;
}
