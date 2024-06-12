import argon2 from "argon2-browser";

function stringToUint8Array(str) {
  const uint8Array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    uint8Array[i] = str.charCodeAt(i);
  }
  return uint8Array;
}

function uint8ArrayToBase64(uint8Array) {
  return String.fromCharCode.apply(null, uint8Array);
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

export async function derivePassword(password, salt) {
  const passwordArray = stringToUint8Array(password);
  const saltArray = stringToUint8Array(salt);
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

export async function deriveKey(password, salt) {
  const passwordArray = stringToUint8Array(password);
  const saltArray = stringToUint8Array(salt);
  let hash = await deriveHash(passwordArray, saltArray);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    hash.hash,
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);

  console.log(uint8ArrayToBase64(exportedKey));

  return exportedKey;
}

export async function aesEncrypt(data) {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  //Получаем ключ из локал сторадж
  const storedKey = localStorage.getItem("derivedKey");

  const importedkey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(importedkey.slice(0, 32)),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  const encdata = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    data
  );

  const encdataString = Array.from(new Uint8Array(encdata))
    .concat(Array.from(iv))
    .join("$");

  return new Uint8Array(encdataString);
}
