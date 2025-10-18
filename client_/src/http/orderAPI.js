import { $authHost, $host } from "./index";

export const addOrder = async (orderInfo, userId) => {
  const { data } = await $authHost.post("api//basket", {
    orderInfo,
    userId,
  });
  return data;
};
export const fetchUserOrders = async (userId) => {
  const { data } = await $authHost.get("api/order/" + userId);
  return data;
};
