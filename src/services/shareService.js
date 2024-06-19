import { aesEncrypt, aesDecrypt } from "../crypto";
import { BASE_URL, SEND_URL } from "../config";

export function generateKeyAndId() {
  const key = crypto.getRandomValues(new Uint8Array(16));
  const id = crypto.randomUUID();
  return { key: btoa(String.fromCharCode(...key)), id };
}

export async function encryptData(data, masterKeyArray) {
  const { encryptedData, iv } = await aesEncrypt(data, masterKeyArray);
  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptData(encryptedData, key, iv) {
  const decryptedData = await aesDecrypt(encryptedData, key, iv);
  return decryptedData;
}

export async function sendDataToServer(id, encryptedData, iv) {
  const response = await fetch(`${BASE_URL}${SEND_URL}${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: encryptedData, iv }),
  });
  return response.json();
}

export async function fetchDataFromServer(id) {
  const response = await fetch(`${BASE_URL}${SEND_URL}${id}`);
  return response.json();
}
