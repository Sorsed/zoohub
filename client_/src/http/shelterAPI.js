import { $host } from "./index";

export const fetchShelters = async () => {
  try {
    const { data } = await $host.get("api/shelter");
    return data;
  } catch (err) {
    return false;
  }
};
