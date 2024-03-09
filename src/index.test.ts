// fastfoodApp.test.ts
import { FastfoodApp } from './interfaces/api';
import { type MysqldbConnection } from './infrastructure/persistence/databases/mysqldb_database';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente antes de executar os testes
dotenv.config({ path: '.env.test' });

describe('FastfoodApp', () => {
  let fastfoodApp: FastfoodApp;
  let mockDbConnection: MysqldbConnection;

  beforeEach(() => {
    mockDbConnection = {
      findId: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      persist: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeFind: async function (Schema: string, Reference: Record<string, any>): Promise<any> {
        throw new Error('Function not implemented.');
      }
    };
    fastfoodApp = new FastfoodApp(mockDbConnection, null);
  });

  it('deve iniciar o aplicativo corretamente', () => {
    // Suprimir a saída do console durante os testes
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Executa o método start e verifica se não há erros
    expect(() => { fastfoodApp.start(); }).not.toThrow();

    // Restaura a função original do console.log após o teste
    jest.restoreAllMocks();
  });
});
