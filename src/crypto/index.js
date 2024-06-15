import argon2 from "argon2-browser";

export function base64ToUint8Array(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

export function uint8ArrayToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function generateSalt(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const slicedHashBuffer = hashBuffer.slice(0, 16);
  const hashArray = new Uint8Array(slicedHashBuffer);

  // Преобразование Uint8Array в строку Base64
  const hashString = uint8ArrayToBase64(hashArray);

  return { hashString, hashArray };
}

export function stringToUint8Array(value) {
  const encoder = new TextEncoder();
  return encoder.encode(value);
}

export async function deriveHash(passwordArray, saltArray) {
  const hash = await argon2.hash({
    pass: passwordArray,
    salt: saltArray,
    time: 3,
    mem: 65536,
    hashLen: 32,
    parallelism: 4,
    type: argon2.ArgonType.Argon2id,
  });
  return hash;
}

export async function derivePassword(passwordArray, saltArray) {
  const hash = await deriveHash(passwordArray, saltArray);
  const passwordHash = await argon2.hash({
    pass: hash.hash,
    salt: passwordArray,
    time: 3,
    mem: 65536,
    hashLen: 32,
    parallelism: 4,
    type: argon2.ArgonType.Argon2id,
  });
  return passwordHash.encoded;
}

export async function deriveKey(passwordArray, saltArray) {
  let hash = await deriveHash(passwordArray, saltArray);

  const hashBuffer = new Uint8Array(hash.hash);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);

  return exportedKey;
}

export async function aesEncrypt(data, masterKey) {
  // Генерация случайного ключа для шифрования данных
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Импорт мастер-ключа как криптографического ключа
  const cryptoMasterKey = await crypto.subtle.importKey(
    "raw",
    masterKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Шифрование данных с использованием случайного ключа
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  // Экспорт случайного ключа
  const exportedKey = await crypto.subtle.exportKey("raw", key);

  // Шифрование экспортированного ключа с использованием мастер-ключа
  const encryptedKey = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoMasterKey,
    exportedKey
  );

  return {
    encryptedData,
    encryptedKey,
    iv,
  };
}

export async function aesDecrypt(iv, key, data, masterKey) {
  const cryptoMasterKey = await crypto.subtle.importKey(
    "raw",
    masterKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decryptedKey = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoMasterKey,
    key
  );

  const importedKey = await crypto.subtle.importKey(
    "raw",
    decryptedKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    importedKey,
    data
  );

  return decryptedData;
}
