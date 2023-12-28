import { Production } from '../entities';
import { type DbConnection } from '../interfaces/dbconnection';
import { type ProductionGatewayInterface } from '../interfaces/ProductionGatewayInterface';

export class ProductionGateway implements ProductionGatewayInterface {
  private readonly repositorioDados: DbConnection;
  private readonly schema = 'productions';

  constructor (database: DbConnection) {
    this.repositorioDados = database;
  }

  async findId (id: bigint): Promise<Production | null> {
    const result = await this.repositorioDados.findId(this.schema, id);

    if (result === null) {
      return null;
    } else {
      return new Production(
        result.id,
        result.orderId,
        result.protocol,
        result.orderDescription,
        result.status,
        result.createdAt,
        result.updatedAt
      );
    }
  }

  async find (reference: Record<string, any>): Promise<Production[] | null> {
    const result = await this.repositorioDados.find(this.schema, reference);

    if (result === null) {
      return null;
    } else {
      const returnData: Production[] = [];
      result.forEach((element: any) => {
        returnData.push(
          new Production(
            element.id,
            element.orderId,
            element.protocol,
            element.orderDescription,
            element.status,
            element.createdAt,
            element.updatedAt
          )
        );
      });
      return returnData;
    }
  }

  async findAll (): Promise<Production[] | null> {
    const result = await this.repositorioDados.findAll(this.schema);

    if (result === null) {
      return null;
    } else {
      const returnData: Production[] = [];
      result.forEach((element: any) => {
        returnData.push(
          new Production(
            element.id,
            element.orderId,
            element.protocol,
            element.orderDescription,
            element.status,
            element.createdAt,
            element.updatedAt
          )
        );
      });
      return returnData;
    }
  }

  async persist (
    orderId: string,
    protocol: string,
    orderDescription: string,
    status: string
  ): Promise<any> {
    const payments = new Production(
      null,
      orderId,
      protocol,
      orderDescription,
      status,
      null,
      null
    )

    const success = await this.repositorioDados.persist(
      this.schema,
      {
        orderId: payments.orderId,
        protocol: payments.protocol,
        orderDescription: payments.orderDescription,
        status: payments.status
      }
    );

    return success;
  }

  async update (
    id: bigint,
    status: string
  ): Promise<any> {
    const payments = new Production(
      id,
      null,
      null,
      null,
      status,
      null,
      null
    )

    const success = await this.repositorioDados.update(
      this.schema,
      id,
      {
        status: payments.status
      }
    );

    return success;
  }

  async remove (id: bigint): Promise<any | null> {
    const result = await this.repositorioDados.remove(this.schema, id);

    return result;
  }
}
