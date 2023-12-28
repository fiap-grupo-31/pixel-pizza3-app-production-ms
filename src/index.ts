import { FastfoodApp } from './interfaces/api';
import { MysqldbConnection } from './infrastructure/persistence/databases/mysqldb_database';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env'
})

const dbconnectionMysql = new MysqldbConnection();
const fastfoodApp = new FastfoodApp(dbconnectionMysql);
fastfoodApp.start();
