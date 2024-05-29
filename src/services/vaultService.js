import { BASE_URL, RECORDS_URL, CATEGORIES_URL } from "../config";

const getAuthHeader = () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  return { Authorization: `JWT ${authTokens.access}` };
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