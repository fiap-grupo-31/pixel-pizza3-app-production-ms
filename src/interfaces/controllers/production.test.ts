import { ProductionController } from './production';
import { Production } from '../../domain/entities';

describe('ProductionController', () => {
  let mockDbConnection: any;

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
  });

  describe('Classe ProductionController', () => {
    it('deve retornar todos os itens de produção', async () => {
      // Call the method being tested
      const mockedProduction: Production[] = [new Production(1, '123', '2', 'teste', 'WAITING', '', '')];
      mockDbConnection.findAll.mockResolvedValueOnce(mockedProduction);
      const result = await ProductionController.getProduction(mockDbConnection);

      // Assertions
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":1,"_orderId":"123","_protocol":"2","_orderDescription":"teste","_status":"WAITING","_created_at":"","_updated_at":""}]}');
    });

    it('deve retornar um exception para todos os itens de produção', async () => {
      // Call the method being tested
      mockDbConnection.findAll.mockResolvedValueOnce(new Error('error'));
      const result = await ProductionController.getProduction(mockDbConnection);

      // Assertions
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar os items de produção por status', async () => {
      const mockedProduction: Production[] = [new Production(1, '123', '2', 'teste', 'WAITING', '', '')];
      mockDbConnection.find.mockResolvedValueOnce(mockedProduction);

      const result = await ProductionController.getProductionByStatus('DONE', mockDbConnection);
      // Assertions
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":[{"_id":1,"_orderId":"123","_protocol":"2","_orderDescription":"teste","_status":"WAITING","_created_at":"","_updated_at":""}]}');
    });

    it('deve retornar um exception para items de produção por status', async () => {
      // Call the method being tested
      mockDbConnection.find.mockResolvedValueOnce(new Error('error'));
      const result = await ProductionController.getProductionByStatus('DONE', mockDbConnection);

      // Assertions
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":{}}');
    });

    it('deve retornar os items de produção por id', async () => {
      const mockedProduction: Production = new Production(1, '123', '2', 'teste', 'WAITING', '', '');
      mockDbConnection.findId.mockResolvedValueOnce(mockedProduction);

      const result = await ProductionController.getPaymentsById(BigInt(1), mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":1,"_orderId":"123","_protocol":"2","_orderDescription":"teste","_status":"WAITING","_created_at":"","_updated_at":""}}');
    });

    it('deve retornar atualizar um item de produção', async () => {
      const mockedProduction: Production = new Production(1, '123', '2', 'teste', 'WAITING', '', '');
      mockDbConnection.update.mockResolvedValueOnce(mockedProduction);
      mockDbConnection.findId.mockResolvedValueOnce(mockedProduction);

      const result = await ProductionController.updateProduction(
        BigInt(2),
        'DONE', {},
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":1,"_orderId":"123","_protocol":"2","_orderDescription":"teste","_status":"WAITING","_created_at":"","_updated_at":""}}');
    });

    it('deve retornar um exception atualizar um item de produção', async () => {
      mockDbConnection.update.mockResolvedValueOnce(new Error('error'));
      mockDbConnection.findId.mockResolvedValueOnce(new Error('error'));
      const result = await ProductionController.updateProduction(
        BigInt(2),
        '',{},
        mockDbConnection);

      // Assertions
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":404,"status":"error","message":"status invalid"}');
    });

    it('deve inserir um novo item de produção', async () => {
      const mockedProduction: Production = new Production(1, '123', '2', 'teste', 'WAITING', '', '');
      mockDbConnection.update.mockResolvedValueOnce(mockedProduction);
      mockDbConnection.findId.mockResolvedValueOnce(mockedProduction);
      mockDbConnection.persist.mockResolvedValueOnce(mockedProduction);

      const result = await ProductionController.setProduction(
        '123',
        '123',
        'teste',
        'DONE',
        mockDbConnection);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toEqual('{"statusCode":200,"status":"success","data":{"_id":1,"_orderId":"123","_protocol":"2","_orderDescription":"teste","_status":"WAITING","_created_at":"","_updated_at":""}}');
    });
  });
});
