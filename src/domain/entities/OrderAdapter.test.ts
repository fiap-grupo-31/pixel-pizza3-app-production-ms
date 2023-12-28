import { type OrderAdapter } from './OrderAdapter';

describe('Entitie OrderAdapter', () => {
  it('Deve criar uma instância válida de OrderAdapter', () => {
    const order: OrderAdapter = {
      orderId: '123',
      status: 'Em processamento'
    };

    expect(order).toBeDefined();
    expect(order.orderId).toBe('123');
    expect(order.status).toBe('Em processamento');
  });
});
