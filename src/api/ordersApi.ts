import { $host } from ".";
import { IOrder } from "../../types/types";

class OrdersApi {
  async getOrders(
    start = 0,
    limit = 10,
    signal: AbortSignal
  ): Promise<IOrder[]> {
    const { data } = await $host.get(
      `/orders?_start=${start}&_limit=${limit}`,
      { signal }
    );
    return data;
  }
  async getOrder(id: number | string, signal: AbortSignal): Promise<IOrder> {
    const { data } = await $host.get(`/orders/${id}`, { signal });
    return data;
  }
  async replaceOrder(
    id: number | string,
    info: IOrder,
    signal: AbortSignal
  ): Promise<IOrder> {
    const { data } = await $host.put(`/orders/${id}`, info, { signal });
    return data;
  }
  async changeOrder(
    id: number | string,
    info: IOrder,
    signal: AbortSignal
  ): Promise<IOrder> {
    const { data } = await $host.patch(`/orders/${id}`, info, {
      signal,
    });
    return data;
  }
  async deleteOrder(id: number | string, signal: AbortSignal): Promise<IOrder> {
    const { data } = await $host.delete(`/orders/${id}`, { signal });
    return data;
  }
}

export const ordersApi = new OrdersApi();
