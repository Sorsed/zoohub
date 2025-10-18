import { $authHost, $host } from "./index";

export const addDeviceToBasket = async (id, userId) => {
  const { data } = await $authHost.post("api/device/" + id, { id, userId });
  alert("Товар добавлен в корзину!");
  return data;
};

export const delDeviceToBasket = async (id, userId) => {
  const { data } = await $authHost.post("api/basket/delete", {
    id,
    userId,
  });
  return data;
};

export const fetchBasketDevices = async (userId) => {
  const { data } = await $authHost.get("api/basket/" + userId);
  return data;
};

export const changeBasketDeviceCount = async (id, userId, operator, count) => {
  const { data } = await $authHost.post("api/basket/changecount", {
    id,
    userId,
    operator,
    count,
  });
  return data;
};
