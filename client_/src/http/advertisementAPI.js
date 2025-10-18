import { $host, $authHost } from "./index";

export const fetchAllMyAdvertisements = async () => {
  const { data } = await $authHost.get("api/advertisement/my");
  return data;
};

export const fetchAllAdvertisements = async () => {
  const { data } = await $host.get("api/advertisement");
  return data;
};

export const fetchAllFilterAdvertisements = async (formData) => {
  const { data } = await $host.post("api/advertisement/filter", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchAdvertisementById = async (id) => {
  try {
    const { data } = await $host.get(`api/advertisement/${id}`);
    return data; // возвращает объект объявления с фото
  } catch (error) {
    console.error("Ошибка при получении объявления:", error);
    throw error;
  }
};

// api/advertisementAPI.js
export const updateAdvertisement = async (id, formData) => {
  const { data } = await $authHost.put(`api/advertisement/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const createAdvertisement = async (formData) => {
  const { data } = await $authHost.post("api/advertisement", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteAdvertisement = async (id) => {
  const { data } = await $authHost.delete(`api/advertisement/${id}`);
  return data;
};

export const fetchUserAds = async (userId) => {
  const { data } = await $host.get(`api/advertisement/user/${userId}`);
  return data;
};
