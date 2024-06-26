import { apiRequest } from "./apiService";
import { encryptItem, decryptItem } from "../crypto/encryption";
import { BASE_URL, AUDIT_URL } from "../config";
import { base64ToUint8Array } from "../crypto";

export const getAuditRecords = async (masterKey, authToken) => {
  const masterKeyArray = base64ToUint8Array(masterKey);
  const url = BASE_URL + AUDIT_URL;

  try {
    const response = await apiRequest(url, "GET", null, authToken);
    const encryptedData = await response.json();
    const decryptedData = await Promise.all(
      encryptedData.map(async (item) => {
        return decryptItem(item, masterKeyArray);
      })
    );

    return decryptedData;
  } catch (error) {
    throw new Error(`Ошибка при получении записей аудита: ${error.message}`);
  }
};

export async function logAuditEvent(eventJson, masterKey, authToken) {
  const url = BASE_URL + AUDIT_URL;
  const masterKeyArray = base64ToUint8Array(masterKey);
  const event = JSON.parse(eventJson);

  try {
    const encryptedEvent = await encryptItem(event, masterKeyArray);
    let response = await apiRequest(url, "POST", encryptedEvent, authToken);
  } catch (error) {
    throw new Error(`Ошибка при логировании события аудита: ${error.message}`);
  }
}
