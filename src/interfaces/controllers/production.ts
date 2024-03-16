import {
  ProductionGateway
} from '../../domain/gateways';
import { OrderApiAdapter } from '../adapters/OrderApiAdapter'
import { type DbConnection } from '../../domain/interfaces/dbconnection';
import {
  ProductionUseCases
} from '../../application/usecases';
import { Global } from '../adapters';

/**
 * Pagamento
 *
 * @export
 * @class ProductionController
 */
export class ProductionController {
  /**
   * Retorna todos os pagamentos listados (todos os status)
   *
   * @static
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof ProductionController
   */
  static async getProduction (dbconnection: DbConnection): Promise<string> {
    const productionGateway = new ProductionGateway(dbconnection);
    const all = await ProductionUseCases.getProductionAll(productionGateway)
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(all);
    return adapted;
  }

  /**
   * Retorna lista de pagamentos por status
   *
   * @static
   * @param {string} reference
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof ProductionController
   */
  static async getProductionByStatus (
    reference: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const productionGateway = new ProductionGateway(dbconnection);
    const allPayments = await ProductionUseCases.getProductionByReference(
      {
        where: {
          status: reference
        }
      },
      productionGateway
    )
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    return JSON.stringify(allPayments);
  }

  /**
   * Retorna pagamento por id
   *
   * @static
   * @param {string} id
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof ProductionController
   */
  static async getPaymentsById (
    id: bigint,
    dbconnection: DbConnection
  ): Promise<string> {
    const productionGateway = new ProductionGateway(dbconnection);
    const production = await ProductionUseCases.getProductionById(id, productionGateway)
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(production);
    return adapted;
  }

  /**
   * Envia um pedido de pagamento para um broker e retorna
   *
   * @static
   * @param {string} orderId
   * @param {string} protocol
   * @param {string} orderDescription
   * @param {string} status
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof ProductionController
   */
  static async setProduction (
    orderId: string,
    protocol: string,
    orderDescription: string,
    status: string,
    dbconnection: DbConnection
  ): Promise<string> {
    const productionGateway = new ProductionGateway(dbconnection);

    const productionObject = await ProductionUseCases.setProduction(
      orderId,
      protocol,
      orderDescription,
      status,
      productionGateway
    )
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    return JSON.stringify(productionObject);
  }

  /**
   * Atualiza parametros de um pagamento
   *
   * @static
   * @param {string} id
   * @param {string} status
   * @param {DbConnection} dbconnection
   * @return {*}  {Promise<string>}
   * @memberof ProductionController
   */
  static async updateProduction (
    id: bigint,
    status: string,
    _rabbitMqService: any,
    dbconnection: DbConnection
  ): Promise<string> {
    const productionGateway = new ProductionGateway(dbconnection);

    if (!id) return JSON.stringify(Global.error('id invalid'));
    if (!status) return JSON.stringify(Global.error('status invalid'));

    const production = await ProductionUseCases.updateProduction(
      id,
      status,
      _rabbitMqService,
      productionGateway
    )
      .then((data) => {
        return Global.success(data);
      })
      .catch((err) => {
        return Global.error(err);
      });

    const adapted = JSON.stringify(production);
    return adapted;
  }
}
