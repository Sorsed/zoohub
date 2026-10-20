import axios from "axios";

const apiBase = process.env.REACT_APP_API_URL || "/";

const $host = axios.create({
  baseURL: apiBase,
  withCredentials: true, // важно для работы с сессиями
});

const $authHost = axios.create({
  baseURL: apiBase,
  withCredentials: true, // автоматически отправляет cookie
});

export { $host, $authHost };
