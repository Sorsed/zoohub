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

export const getMyprofile = async () => {
  try {
    const { data } = await $authHost.get("api/profile/my");
    return data;
  } catch (err) {
    return false;
  }
};
//
// Обновление профиля
export const updateProfile = async (formData) => {
  const { data } = await $authHost.post("api/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await $host.get(`api/profile/other/${id}`);
  return data;
};
