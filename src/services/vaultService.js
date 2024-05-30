import { BASE_URL, RECORDS_URL, CATEGORIES_URL } from "../config";

const getAuthHeader = () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  return { Authorization: `JWT ${authTokens.access}` };
};

const omitId = (record) => {
  const { id, ...rest } = record;
  return rest;
};

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
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при получении записей");
  }
};

export const createRecord = async (record) => {
  const authHeader = getAuthHeader();
  const url = BASE_URL + RECORDS_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(omitId(record)),
  });

  const data = await response.json();

  if (response.status === 201) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при создании записи");
  }
};

export const updateRecord = async (record) => {
  const authHeader = getAuthHeader();
  const url = `${BASE_URL + RECORDS_URL}/${record.id}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(omitId(record)),
  });

  const data = await response.json();

  if (response.status === 200) {
    return { status: response.status, data };
  } else if (response.status === 401) {
    throw new Error("Неавторизован");
  } else {
    throw new Error("Ошибка при обновлении записи");
  }
};
