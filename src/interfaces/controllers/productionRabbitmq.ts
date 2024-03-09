/* eslint-disable @typescript-eslint/no-this-alias */
import { ProductionController } from './production';
import { type DbConnection } from '../../domain/interfaces/dbconnection';

export class ProductionRabbitmqController {
  static async startConsuming (_dbconnection: DbConnection, _rabbitMqService: any): Promise<void> {
    try {
      _rabbitMqService.consume('productions', (message: any) => {
        const fn: any = this
        if (typeof fn[message.event] !== 'undefined') {
          fn[message.event](message, _dbconnection, _rabbitMqService);
        }
      });
    } catch (error) {
    }
  }

  static async createProduction (data: any, _dbconnection: DbConnection, _rabbitMqService: any): Promise<any> {
    console.log('....', data)
    const production = await ProductionController.setProduction(
      data?.id,
      data?.protocol,
      data?.orderDescription,
      data?.status,
      _dbconnection
    )

    const productionObject = JSON.parse(production);

    if (!productionObject?.data?._id) {
      // REJEITA ORDEM
      _rabbitMqService.sendMessage('orders', {
        event: 'rejectOrder',
        orderId: productionObject?.data?._orderId,
        message: 'Error'
      })
    } else {
      _rabbitMqService.sendMessage('orders', {
        event: 'aceptedOrder',
        orderId: productionObject?.data?._orderId,
        productionReference: productionObject?.data?._id,
        message: ''
      })
    }
  }
}
