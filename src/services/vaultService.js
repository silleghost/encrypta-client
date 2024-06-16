import { BASE_URL, RECORDS_URL, CATEGORIES_URL, CARDS_URL } from "../config";
import {
  aesEncrypt,
  aesDecrypt,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from "../crypto";
const getAuthHeader = () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  return { Authorization: `JWT ${authTokens.access}` };
};

const omitId = (record) => {
  const { id, ...rest } = record;
  return rest;
};

function encryptDataToString(iv, key, data) {
  return `${uint8ArrayToBase64(iv)}$${uint8ArrayToBase64(
    key
  )}$${uint8ArrayToBase64(data)}`;
}

function decryptStringToData(encryptedString) {
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

async function encryptRecord(record) {
  const encryptedRecord = {};
  const encoder = new TextEncoder();

  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  // Шифрование каждого поля отдельно, кроме id
  for (const [key, value] of Object.entries(record)) {
    if (
      key === "id" ||
      key === "category" ||
      key === "lastmodified_date" ||
      key === "creation_date" ||
      key === "favicon"
    )
      continue; // Пропускаем поле id

    const fieldValueString = JSON.stringify(value);
    const fieldValueArray = encoder.encode(fieldValueString);
    const encryptedField = await aesEncrypt(fieldValueArray, masterKeyArray);

    // Формирование строки в формате {iv}${key}${data}
    encryptedRecord[key] = encryptDataToString(
      encryptedField.iv,
      encryptedField.encryptedKey,
      encryptedField.encryptedData
    );
  }

  encryptedRecord["id"] = record.id;

  if (record.category !== null) {
    encryptedRecord["category"] = record.category;
  }

  return encryptedRecord;
}

async function decryptRecord(encryptedRecord) {
  const decryptedRecord = {};
  const decoder = new TextDecoder("utf-8");
  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  for (const [key, value] of Object.entries(encryptedRecord)) {
    if (
      key === "id" ||
      key === "category" ||
      key === "favicon" ||
      key === "creation_date" ||
      key === "lastmodified_date"
    ) {
      decryptedRecord[key] = value; // Пропускаем шифрование для id и category
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

  decryptedRecord["id"] = encryptedRecord.id;

  return decryptedRecord;
}

export const getRecords = async () => {
  const authHeader = getAuthHeader();
  let response = await fetch(BASE_URL + RECORDS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });
  let data = await response.json();
  if (response.status === 200) {
    // Расшифровка каждой записи в массиве
    const decryptedData = await Promise.all(
      data.map(async (record) => {
        return await decryptRecord(record);
      })
    );
    return { status: response.status, data: decryptedData };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении записей");
  }
};

export const createRecord = async (record) => {
  const authHeader = getAuthHeader();
  const url = BASE_URL + RECORDS_URL;

  const encryptedRecord = await encryptRecord(record);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedRecord),
  });

  const responseData = await response.json();

  if (response.status === 201) {
    return { status: response.status, data: responseData };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при создании записи");
  }
};

export const updateRecord = async (record) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + RECORDS_URL}${record.id}/`;

  const encryptedRecord = await encryptRecord(record);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedRecord),
  });

  const data = await response.json();

  if (response.status === 200) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при обновлени записи");
  }
};

export const deleteRecord = async (recordId) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + RECORDS_URL}${recordId}/`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  const data = await response.json();

  if (response.status === 204) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при удалении записи");
  }
};

async function encryptCategory(category) {
  const encryptedCategory = {};
  const encoder = new TextEncoder();

  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const categoryNameString = JSON.stringify(category.name);
  const categoryNameArray = encoder.encode(categoryNameString);
  const encryptedName = await aesEncrypt(categoryNameArray, masterKeyArray);

  encryptedCategory["name"] = encryptDataToString(
    encryptedName.iv,
    encryptedName.encryptedKey,
    encryptedName.encryptedData
  );

  return encryptedCategory;
}

async function decryptCategory(encryptedCategory) {
  const decryptedCategory = {};
  const decoder = new TextDecoder("utf-8");

  const masterKey = localStorage.getItem("masterKey");
  const masterKeyArray = new Uint8Array(
    atob(masterKey)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const {
    iv,
    key: encryptedKey,
    data: encryptedData,
  } = decryptStringToData(encryptedCategory.name);

  const decryptedData = await aesDecrypt(
    iv,
    encryptedKey,
    encryptedData,
    masterKeyArray
  );

  const decryptedNameString = decoder.decode(decryptedData);
  decryptedCategory["name"] = JSON.parse(decryptedNameString);
  decryptedCategory["id"] = encryptedCategory.id;

  return decryptedCategory;
}

export const getCategories = async () => {
  const authHeader = getAuthHeader();
  let response = await fetch(BASE_URL + CATEGORIES_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });
  let data = await response.json();
  if (response.status === 200) {
    const decryptedData = await Promise.all(
      data.map(async (category) => {
        return await decryptCategory(category);
      })
    );
    return { status: response.status, data: decryptedData };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении категорий");
  }
};

export const createCategory = async (category) => {
  const authHeader = getAuthHeader();
  const url = BASE_URL + CATEGORIES_URL;

  const encryptedCategory = await encryptCategory(category);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedCategory),
  });

  const data = await response.json();

  if (response.status === 201) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при создании категории");
  }
};

export const updateCategory = async (category) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + CATEGORIES_URL}${category.id}/`;

  const encryptedCategory = await encryptCategory({ name: category.name });

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedCategory),
  });

  const data = await response.json();

  if (response.status === 200) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при изменении категории");
  }
};

export const deleteCategory = async (categoryId) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + CATEGORIES_URL}${categoryId}/`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  const data = await response.json();

  if (response.status === 204) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при удалении категории");
  }
};

export const getCards = async () => {
  const authHeader = getAuthHeader();
  let response = await fetch(BASE_URL + CARDS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });
  let data = await response.json();
  if (response.status === 200) {
    const decryptedData = await Promise.all(
      data.map(async (card) => {
        return await decryptRecord(card);
      })
    );
    return { status: response.status, data: decryptedData };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении карт");
  }
};

export const createCard = async (card) => {
  const authHeader = getAuthHeader();
  const url = BASE_URL + CARDS_URL;

  const encryptedCard = await encryptRecord(card);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedCard),
  });

  const data = await response.json();

  if (response.status === 201) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при создании карты");
  }
};

export const updateCard = async (card) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + CARDS_URL}${card.id}/`;

  const encryptedCard = await encryptRecord(card);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(encryptedCard),
  });

  const data = await response.json();

  if (response.status === 200) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при изменении карты");
  }
};

export const deleteCard = async (cardId) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + CARDS_URL}${cardId}/`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  const data = await response.json();

  if (response.status === 204) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при удалении карты");
  }
};
