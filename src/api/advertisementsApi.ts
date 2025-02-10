import { $host } from ".";
import { IAdvertisment } from "../../types/types";

class AdvertisementsApi {
  async getAdvertisements(
    start = 0,
    limit = 10,
    signal: AbortSignal
  ): Promise<IAdvertisment[]> {
    const { data } = await $host.get(
      `/advertisements?_start=${start}&_limit=${limit}`,
      { signal }
    );
    return data;
  }
  async makeAdvertisement(
    info: IAdvertisment,
    signal: AbortSignal
  ): Promise<IAdvertisment> {
    const { data } = await $host.post(`/advertisements`, info, { signal });
    return data;
  }
  async getAdvertisement(
    id: number | string,
    signal: AbortSignal
  ): Promise<IAdvertisment> {
    const { data } = await $host.get(`/advertisements/${id}`, { signal });
    return data;
  }
  async replaceAdvertisement(
    id: number | string,
    info: IAdvertisment,
    signal: AbortSignal
  ): Promise<IAdvertisment> {
    const { data } = await $host.put(`/advertisements/${id}`, info, { signal });
    return data;
  }
  async changeAdvertisement(
    id: number | string,
    info: IAdvertisment,
    signal: AbortSignal
  ): Promise<IAdvertisment> {
    const { data } = await $host.patch(`/advertisements/${id}`, info, {
      signal,
    });
    return data;
  }
  async deleteAdvertisement(
    id: number | string,
    signal: AbortSignal
  ): Promise<IAdvertisment> {
    const { data } = await $host.delete(`/advertisements/${id}`, { signal });
    return data;
  }
}

export const advertisementsApi = new AdvertisementsApi();
