import argon2 from "argon2-browser";

export async function deriveKey(password, salt) {
  // Создание мастер-ключа с использованием Argon2
  const hash = await argon2.hash({
    pass: password,
    salt: salt,
    time: 3,
    mem: 65536,
    hashLen: 32,
    parallelism: 4,
    type: argon2.ArgonType.Argon2id,
  });

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    hash.hash,
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);

  return exportedKey;
}

export async function aesEncrypt(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(16));

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
