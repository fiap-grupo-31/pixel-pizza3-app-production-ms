/* eslint-disable prefer-promise-reject-errors */
import { Production } from '../../domain/entities/Production';
import { type ProductionGatewayInterface } from '../../domain/interfaces/ProductionGatewayInterface';
import { type OrderApiAdapter } from '../../interfaces/adapters/OrderApiAdapter';

class ProductionUseCases {
  static async getProductionAll (
    paymentsGateway: ProductionGatewayInterface
  ): Promise<Production[] | null> {
    return await paymentsGateway.findAll();
  }

  static async getProductionByReference (
    reference: Record<string, any>,
    paymentsGateway: ProductionGatewayInterface
  ): Promise<Production[] | null> {
    return await paymentsGateway.find(reference);
  }

  static async getProductionById (
    id: bigint,
    paymentsGateway: ProductionGatewayInterface
  ): Promise<Production | null> {
    return await paymentsGateway.findId(id);
  }

  static async setProduction (
    orderId: string,
    protocol: string,
    orderDescription: string,
    status: string,
    paymentsGateway: ProductionGatewayInterface
  ): Promise<Production | null> {
    try {
      const payments = await paymentsGateway.persist(
        orderId,
        protocol,
        orderDescription,
        status
      );
      return new Production(
        payments.id,
        payments.orderId,
        payments.protocol,
        payments.orderDescription,
        payments.status,
        payments.created_at,
        payments.updated_at
      );
    } catch (error) {
      return await Promise.reject('failure insert');
    }
  }

  static async updateProduction (
    id: bigint,
    status: string,
    orderApiAdapter: OrderApiAdapter,
    paymentsGateway: ProductionGatewayInterface
  ): Promise<Production | null> {
    const entity = new Production(
      id,
      null,
      null,
      null,
      status,
      null,
      null
    );
    if (!entity.statusCheck) return await Promise.reject('production inválid');

    try {
      await paymentsGateway.update(
        id,
        status
      );

      const production = await paymentsGateway.findId(id);

      await orderApiAdapter.updateOrder(production?.orderId ?? '', status)

      return production
    } catch (error) {
      console.log(error)
      return await Promise.reject('failure update');
    }
  }
}

export { ProductionUseCases };