import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export interface OrderApiAdapterInterface {
  updateOrder: (orderId: string, status: string) => Promise<boolean>
}

export class OrderApiAdapter implements OrderApiAdapterInterface {
  private readonly axiosInstance: AxiosInstance;

  constructor (baseURL: string, instance: any) {
    this.axiosInstance = (!instance
      ? axios.create({
        baseURL
      })
      : instance);
  }

  async updateOrder (orderId: string, status: string): Promise<boolean> {
    try {
      if (orderId.length < 24) {
        return false;
      }
      const response: AxiosResponse = await this.axiosInstance.put(`/orders/${orderId}`, {
        status
      });

      if (response.status !== 200) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
