import { $host, $authHost } from "./index";

// Регистрация
export const registration = async (formData) => {
  const { data } = await $host.post("api/user/registration", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return data;
};

// Логин
export const login = async (user_email, password) => {
  const { data } = await $host.post("api/user/login", {
    user_email,
    password,
  });
  return data; // сессия установится через cookie
};

export const check = async () => {
  try {
    const { data } = await $authHost.get("api/user/auth");
    return data;
  } catch (err) {
    return false;
  }
};
//
// Обновление профиля
export const change = async (id, newItem, field) => {
  const { data } = await $authHost.post("api/profile", { id, newItem, field });
  return data;
};

// Логаут
export const logout = async () => {
  try {
    const { data } = await $authHost.get("api/user/logout"); // POST-запрос для выхода
    return data; // например { msg: "Вы вышли из системы" }
  } catch (err) {
    return { msg: "Ошибка при выходе" };
  }
};
