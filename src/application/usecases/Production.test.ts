import { ProductionUseCases } from './Production';
import { Production } from '../../domain/entities';

const mockProductionGateway = {
  findAll: jest.fn(),
  find: jest.fn(),
  findId: jest.fn(),
  persist: jest.fn(),
  update: jest.fn()
};

const mockOrderApiAdapter: any = {
  updateOrder: jest.fn().mockResolvedValue(true)
};

const mockPaymentDataDefault = {
  id: 1,
  orderId: '111',
  protocol: '2',
  orderDescription: 'teste',
  status: 'WAITING',
  created_at: '',
  updated_at: ''
};

describe('Produção', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar todos os pedidos em produção', async () => {
    mockProductionGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await ProductionUseCases.getProductionAll(mockProductionGateway);
    expect(mockProductionGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual([
    ]);
  });

  it('Deve retornar uma lista vazia de pedidos em produção', async () => {
    mockProductionGateway.find.mockResolvedValueOnce([
    ]);

    const result = await ProductionUseCases.getProductionByReference(
      {},
      mockProductionGateway
    );
    expect(mockProductionGateway.find).toHaveBeenCalledWith({});
    expect(result).toEqual([
    ]);
  });

  it('Deve retornar um pedido por referencia ( status )', async () => {
    mockProductionGateway.find.mockResolvedValueOnce([
    ]);

    const result = await ProductionUseCases.getProductionByReference(
      {
        id: 1
      },
      mockProductionGateway
    );
    expect(mockProductionGateway.find).toHaveBeenCalledWith({
      id: 1
    });
    expect(result).toEqual([]);
  });

  it('Deve retornar um pedido em produção por id', async () => {
    const mockPayment = {
    };
    mockProductionGateway.findId.mockResolvedValueOnce(mockPayment);

    const result = await ProductionUseCases.getProductionById(
      BigInt(1),
      mockProductionGateway
    );
    expect(mockProductionGateway.findId).toHaveBeenCalledWith(BigInt(1));
    expect(result).toEqual(mockPayment);
  });

  it('Deve retornar um pedido para produção', async () => {
    const mockPaymentData = mockPaymentDataDefault;
    mockProductionGateway.persist.mockResolvedValueOnce(mockPaymentData);

    const result = await ProductionUseCases.setProduction(
      '111',
      '2',
      'teste',
      'WAITING',
      mockProductionGateway
    );
    expect(mockProductionGateway.persist).toHaveBeenCalledWith(
      '111',
      '2',
      'teste',
      'WAITING'
    );

    expect(result).toEqual(new Production(1, '111', '2', 'teste', 'WAITING', '', ''));
  });

  it('Deve retornar uma exceção ao tentar inserir um pedido', async () => {
    const expectedError = 'failure insert';
    mockProductionGateway.persist.mockRejectedValueOnce(expectedError);

    try {
      await ProductionUseCases.setProduction(
        '111',
        '2',
        'teste',
        'WAITING',
        mockProductionGateway
      );
      expect(true).toBe(false); // Garante que o teste falhe se o código chegar aqui
    } catch (error: any) {
      expect(error.message).toBe('failure insert');
    }
  });

  it('Deve atualizar o pedido em produção', async () => {
    const mockUpdatedPayment = {
      id: 2,
      orderId: '123',
      protocol: '2',
      orderDescription: 'teste',
      status: 'DONE',
      created_at: '',
      updated_at: ''
    };
    mockProductionGateway.findId.mockResolvedValueOnce(new Production(2, '123', '2', 'teste', 'DONE', '', ''));
    mockProductionGateway.update.mockResolvedValueOnce(mockUpdatedPayment);

    jest.spyOn(mockOrderApiAdapter, 'updateOrder').mockResolvedValueOnce(true);

    const result = await ProductionUseCases.updateProduction(
      BigInt(2),
      'DONE',
      mockOrderApiAdapter,
      mockProductionGateway
    );

    expect(mockProductionGateway.update).toHaveBeenCalledWith(
      BigInt(2),
      'DONE'
    );

    expect(result).toEqual(new Production(2, '123', '2', 'teste', 'DONE', '', ''));
  });

  it('Deve retornar uma exceção atualizar o pedido em produção com status de production invalido', async () => {
    jest.spyOn(mockOrderApiAdapter, 'updateOrder').mockResolvedValueOnce(true);

    try {
      await ProductionUseCases.updateProduction(
        BigInt(2),
        'TESTE',
        mockOrderApiAdapter,
        mockProductionGateway
      );
      expect(mockProductionGateway.update).toThrow('production inválid');
    } catch (error: any) {
      expect(error.message).toBe('production inválid');
    }
  });
});
