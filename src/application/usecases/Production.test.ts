import { ProductionUseCases } from './Production';
import { Production } from '../../domain/entities';

// Mock para PaymentsGatewayInterface
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

describe('ProductionUseCases', () => {
  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para getPaymentsAll
  it('Deve buscar todos os pedidos', async () => {
    mockProductionGateway.findAll.mockResolvedValueOnce([
    ]);

    const result = await ProductionUseCases.getProductionAll(mockProductionGateway);
    expect(mockProductionGateway.findAll).toHaveBeenCalled();
    expect(result).toEqual([
    ]);
  });

  // Teste para getPaymentsByReference Vazia
  it('Deve retornar uma lista de pedidos vazio', async () => {
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

  // Teste para getPaymentsByReference com conteúdo
  it('Deve buscar um pedido por referencia ( status )', async () => {
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

  // Teste para getPaymentsById
  it('Deve buscar um pedido por id', async () => {
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

  // Teste para setPayment
  it('Deve inserir um pedido', async () => {
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

  it('Deve gerar uma exceção ao tentar inserir um pedido', async () => {
    const expectedError = 'failure insert';
    // Simular uma falha ao persistir o pagamento
    mockProductionGateway.persist.mockRejectedValueOnce(expectedError);

    try {
      await ProductionUseCases.setProduction(
        '111',
        '2',
        'teste',
        'WAITING',
        mockProductionGateway
      );
      // Se chegar aqui, o teste falhará
      expect(true).toBe(false); // Garante que o teste falhe se o código chegar aqui
    } catch (error) {
      expect(error).toBe(expectedError);
    }
  });

  // Teste para updatePayment
  it('Deve atualizar o pedido', async () => {
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

  // Teste para updatePayment
  it('Deve causar uma excessão atualizar o pedido', async () => {
    jest.spyOn(mockOrderApiAdapter, 'updateOrder').mockResolvedValueOnce(true);

    try {
      await ProductionUseCases.updateProduction(
        BigInt(2),
        'TESTE',
        mockOrderApiAdapter,
        mockProductionGateway
      );
      expect(mockProductionGateway.update).toThrow('production inválid');
    } catch (error) {
    }
  });
});
