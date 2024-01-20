import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OrderApiAdapter } from './OrderApiAdapter';

describe('OrderApiAdapter', () => {
  const baseURL = 'http://192.168.0.128:8000/api/v1.0/admin';

  let orderApiAdapter: OrderApiAdapter;
  let axiosInstanceMock: AxiosInstance;
  let mock: MockAdapter;

  beforeEach(() => {
    axiosInstanceMock = axios.create();
    orderApiAdapter = new OrderApiAdapter(baseURL, axiosInstanceMock);

    mock = new MockAdapter(axiosInstanceMock);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('updateOrder', () => {
    it('Deve atualizar o status do pedido com sucesso', async () => {
      const orderId = '658c7b3f83bfd949825a4775';
      const status = 'DONE';

      mock.onPut(`/orders/${orderId}`).reply(200, {});

      const promise = orderApiAdapter.updateOrder(orderId, status);
      const result = await promise;

      expect(result).toBe(true);
    });

    it('Deve retornar falso em caso de falha na solicitação de atualização', async () => {
      const orderId = '123';
      const status = 'Shipped';

      mock.onPut(`/orders/${orderId}`).networkError();

      const promise = orderApiAdapter.updateOrder(orderId, status);
      const result = await promise;

      expect(result).toBe(false);
    });
  });
});
