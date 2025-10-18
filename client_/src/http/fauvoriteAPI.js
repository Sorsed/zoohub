import { $authHost } from "./index"; // аутентифицированный axios instance

export const addToFavourites = async (advertisement_id) => {
  const { data } = await $authHost.post("api/favourite/add", {
    advertisement_id,
  });
  return data;
};

export const removeFromFavourites = async (advertisement_id) => {
  const { data } = await $authHost.post("api/favourite/del", {
    advertisement_id,
  });
  return data;
};

export const checkFavourite = async (adId) => {
  const { data } = await $authHost.get(`api/favourite/${adId}`);
  return data; // например { isFavourite: true }
};
export const getALLFavourites = async (adId) => {
  const { data } = await $authHost.get(`api/favourite`);
  return data; // например { isFavourite: true }
};
