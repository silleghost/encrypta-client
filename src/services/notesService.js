import { BASE_URL, NOTES_URL } from "../config";
import {
  aesEncrypt,
  aesDecrypt,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from "../crypto";
import { logAuditEvent } from "./auditService";

const getAuthHeader = () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  return { Authorization: `JWT ${authTokens.access}` };
};

const encryptDataToString = (iv, key, data) => {
  return `${uint8ArrayToBase64(iv)}$${uint8ArrayToBase64(
    key
  )}$${uint8ArrayToBase64(data)}`;
};

const decryptStringToData = (encryptedString) => {
  const parts = encryptedString.split("$");
  return {
    iv: base64ToUint8Array(parts[0]),
    key: base64ToUint8Array(parts[1]),
    data: base64ToUint8Array(parts[2]),
  };
};

async function encryptNote(note) {
  const encryptedNote = {};
  const encoder = new TextEncoder();
  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  for (const [key, value] of Object.entries(note)) {
    if (key === "id") continue; // Пропускаем поле id

    const fieldValueString = JSON.stringify(value);
    const fieldValueArray = encoder.encode(fieldValueString);
    const encryptedField = await aesEncrypt(fieldValueArray, masterKeyArray);

    encryptedNote[key] = encryptDataToString(
      encryptedField.iv,
      encryptedField.encryptedKey,
      encryptedField.encryptedData
    );
  }

  encryptedNote["id"] = note.id;
  return encryptedNote;
}

async function decryptNote(encryptedNote) {
  const decryptedNote = {};
  const decoder = new TextDecoder("utf-8");
  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  for (const [key, value] of Object.entries(encryptedNote)) {
    if (key === "id") {
      decryptedNote[key] = value;
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
    decryptedNote[key] = JSON.parse(decryptedValueString);
  }

  decryptedNote["id"] = encryptedNote.id;
  return decryptedNote;
}

export const getNotes = async () => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + NOTES_URL}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  if (response.status === 200) {
    const encryptedNotes = await response.json();
    const decryptedNotes = await Promise.all(
      encryptedNotes.map(async (note) => {
        return await decryptNote(note);
      })
    );
    return { status: response.status, data: decryptedNotes };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении заметок");
  }
};

export const createNote = async (note) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + NOTES_URL}`;
  const encryptedNote = await encryptNote(note);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedNote),
  });

  const data = await response.json();
  logAuditEvent({
    action: "createNote",
    status: response.status,
    details: note.title,
  });

  if (response.status === 201) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при создании заметки");
  }
};

export const updateNote = async (note) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + NOTES_URL}/${note.id}`;
  const encryptedNote = await encryptNote(note);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedNote),
  });

  if (response.status === 200) {
    const updatedEncryptedNote = await response.json();
    const updatedNote = await decryptNote(updatedEncryptedNote);
    logAuditEvent({
      action: "updateNote",
      status: response.status,
      details: note.title,
    });
    return { status: response.status, data: updatedNote };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при обновлении заметки");
  }
};

export const deleteNote = async (noteId) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + NOTES_URL}/${noteId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  if (response.status === 200) {
    return { status: response.status };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при удалении заметки");
  }
};
