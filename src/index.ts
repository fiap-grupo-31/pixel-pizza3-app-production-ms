import { FastfoodApp } from './interfaces/api';
import { MysqldbConnection } from './infrastructure/persistence/databases/mysqldb_database';
import { RabbitMQService } from './infrastructure/external/rabbitmq/rabbitmq';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env'
})

console.log('API API_ORDER_BASEURL', process.env.API_ORDER_BASEURL)
console.log('API API_PAYMENT_BASEURL', process.env.API_PAYMENT_BASEURL)
console.log('API API_PRODUCTION_BASEURL', process.env.API_PRODUCTION_BASEURL)

const dbconnectionMysql = new MysqldbConnection();
const rabbitMQService = new RabbitMQService();
const fastfoodApp = new FastfoodApp(dbconnectionMysql, rabbitMQService);
fastfoodApp.start();
