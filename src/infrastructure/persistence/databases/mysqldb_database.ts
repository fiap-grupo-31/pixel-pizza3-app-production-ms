import { type DbConnection } from '../../../domain/interfaces/dbconnection';
import { type ParametroBd } from '@types';
import { Sequelize } from 'sequelize-typescript';

import {
  Production
} from './mysql/index';

let sequelize: any = null;
const getSchemas = (key: string): any => {
  let models: any = null;
  switch (key) {
    case 'productions':
      models = Production;
      break;
  }
  return models;
};

export class MysqldbConnection implements DbConnection {
  constructor () {
    const {
      MYSQL_DB_HOST,
      MYSQL_DB_PORT,
      MYSQL_DB_DATABASE,
      MYSQL_DB_USER,
      MYSQL_DB_PASS,
      MYSQL_DB_STRING_CLOUD
    } = process.env;

    console.log({
      database: MYSQL_DB_DATABASE,
      username: MYSQL_DB_USER,
      password: MYSQL_DB_PASS,
      dialect: 'mysql',
      host: MYSQL_DB_HOST,
      port: parseInt(MYSQL_DB_PORT ?? '3306')
    })
    sequelize = new Sequelize({
      database: MYSQL_DB_DATABASE,
      username: MYSQL_DB_USER,
      password: MYSQL_DB_PASS,
      dialect: 'mysql',
      host: MYSQL_DB_HOST,
      port: parseInt(MYSQL_DB_PORT ?? '3306')
    });

    sequelize
      .authenticate()
      .then(async () => {
        sequelize.addModels([Production]);
        try {
          await sequelize.sync({ force: false });
          console.log('Tabelas sincronizadas com sucesso!');
        } catch (error) {
          console.error('Erro ao sincronizar tabelas:', error);
        }

        console.log('Conexão bem-sucedida com o banco de dados.');
      })
      .catch((err: any) => {
        sequelize = new Sequelize({
          username: MYSQL_DB_USER,
          password: MYSQL_DB_PASS,
          dialect: 'mysql',
          host: MYSQL_DB_HOST,
          port: parseInt(MYSQL_DB_PORT ?? '3306')
        });

        sequelize.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB_DATABASE};`).then(() => {
          console.log('Banco de dados criado ou já existente.');
          process.exit(1);
        }).catch((err: any) => {
          console.error('Erro ao criar o banco de dados:', err);
        });

        console.error('Erro ao conectar-se ao banco de dados:', err);
      });
  }

  async findId (Schema: string, Id: bigint): Promise<any> {
    const model = getSchemas(Schema);
    const rows = await model.findByPk(Id);

    return rows;
  }

  async find (Schema: string, Reference: Record<string, any>): Promise<any> {
    const model = getSchemas(Schema);
    const rows = await model.findAll(Reference);

    return rows;
  }

  async findAll (Schema: string): Promise<any[]> {
    const model = getSchemas(Schema);
    const rows = await model.findAll();

    return rows;
  }

  async persist (Schema: string, parametros: ParametroBd[] | Object): Promise<any> {
    let objectInsert: Record<string, any> = {};

    if (Array.isArray(parametros)) {
      parametros.forEach(function (item) {
        if (item.valor != null) objectInsert[item.campo] = item.valor;
      });
    } else {
      objectInsert = parametros
    }

    const model = getSchemas(Schema);
    // eslint-disable-next-line new-cap
    const Instance = await model.create(objectInsert);
    return Instance;
  }

  async update (
    Schema: string,
    Id: bigint,
    parametros: ParametroBd[] | Object
  ): Promise<any> {
    let objectUpdate: Record<string, any> = {};

    if (Array.isArray(parametros)) {
      parametros.forEach(function (item) {
        if (item.valor != null) objectUpdate[item.campo] = item.valor;
      });
    } else {
      objectUpdate = parametros
    }
    const model = getSchemas(Schema);

    const Instance = await model.update(objectUpdate, {
      where: { id: Id }
    });
    return Instance;
  }

  async remove (Schema: string, Id: bigint): Promise<any> {
    const model = getSchemas(Schema);
    const rowDelete = await model.findOneAndDelete({
      _id: Id
    });

    return !!rowDelete;
  }

  async removeFind (
    Schema: string,
    Reference: Record<string, any>
  ): Promise<any> {
    const model = getSchemas(Schema);

    const rows = await model.find(Reference);
    let qde = 0;
    for (const row of rows) {
      await model.findOneAndDelete({
        _id: row._id
      });
      qde++;
    }

    return !!qde;
  }
}
