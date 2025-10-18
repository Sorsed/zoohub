import axios from "axios";

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // важно для работы с сессиями
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // автоматически отправляет cookie
});

export { $host, $authHost };
