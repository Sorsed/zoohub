import { $authHost, $host } from "./index";

export const createType = async (type) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get("api/type");
  return data;
};

export const createBrand = async (brand) => {
  const { data } = await $authHost.post("api/brand", brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $host.get("api/brand");
  return data;
};

export const createDevice = async (device) => {
  const { data } = await $authHost.post("api/device", device);
  return data;
};

export const changeDevice = async (formData) => {
  const { data } = await $authHost.post("api/device/change", formData);
  return data;
};

export const fetchDevices = async (
  typeId,
  brandId,
  page,
  limit,
  from,
  after
) => {
  const { data } = await $host.get("api/device", {
    params: {
      typeId,
      brandId,
      page,
      limit,
      from,
      after,
    },
  });
  console.log(data);
  return data;
};

export const fetchOneDevice = async (id) => {
  const { data } = await $host.get("api/device/" + id);
  return data;
};

export const deleteType = async (typeId) => {
  console.log(typeId);
  const { data } = await $authHost.post("api/type/delete", typeId);
  return data;
};

export const deleteBrand = async (brandId) => {
  const { data } = await $authHost.post("api/brand/delete", brandId);
  return data;
};
export const deleteDevice = async (deviceId) => {
  const { data } = await $authHost.post("api/device/delete", deviceId);
  return data;
};
