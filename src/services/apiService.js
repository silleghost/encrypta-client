import { aesEncrypt, base64ToUint8Array } from "../crypto";
import { encryptItem, decryptItem } from "../crypto/encryption";
import { logAuditEvent } from "../services/auditService";

export async function apiRequest(url, method, body = null, authToken) {
  const headers = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `JWT ${authToken}` } : {}),
  };

  let response = await fetch(url, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при выполнении запроса: ${response.statusText}`);
  }

  return response;
}

export const saveObject = async (url, object, masterKey, authToken) => {
  const masterKeyArray = base64ToUint8Array(masterKey);
  const encryptedObject = await encryptItem(object, masterKeyArray);
  let response;
  if (object.id) {
    response = await apiRequest(
      url + object.id + "/",
      "PUT",
      encryptedObject,
      authToken
    );
  } else {
    response = await apiRequest(url, "POST", encryptedObject, authToken);
  }
  const data = await response.json();

  logAuditEvent(
    JSON.stringify({
      action: object.id ? "Обновлена запись" : "Создана запись",
      details: object.name || object.app_name || object.card_name,
    }),
    masterKey,
    authToken
  );

  if (response.status === 200 || response.status === 201) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при сохранении объекта");
  }
};

export const deleteObject = async (url, object, masterKey, authToken) => {
  const response = await apiRequest(
    url + object.id + "/",
    "DELETE",
    null,
    authToken
  );
  const data = await response.json();

  logAuditEvent(
    JSON.stringify({
      action: "Удалена запись",
      details: object.name || object.app_name || object.card_name,
    }),
    masterKey,
    authToken
  );

  if (response.status === 204) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при удалении объекта");
  }
};

export const getObjects = async (url, masterKey, authToken) => {
  const response = await apiRequest(url, "GET", null, authToken);
  const data = await response.json();
  const masterKeyArray = base64ToUint8Array(masterKey);

  if (response.status === 200) {
    const decryptedData = await Promise.all(
      data.map(async (item) => {
        return await decryptItem(item, masterKeyArray);
      })
    );
    return { status: response.status, data: decryptedData };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении объектов");
  }
};
