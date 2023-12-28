import { ProductionGateway } from './Production';
import { Production } from '../entities';

const mockDbConnection: any = {
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

describe('ProductionGateway', () => {
  let productionGateway: ProductionGateway;

  beforeEach(() => {
    productionGateway = new ProductionGateway(mockDbConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve buscar um pedido por ID', async () => {
    const mockedProduction: Production = new Production(1, '123', '2', 'teste', 'WAITING', '', '');

    mockDbConnection.findId.mockResolvedValueOnce(mockedProduction);

    const result = await productionGateway.findId(BigInt(1));

    expect(mockDbConnection.findId).toHaveBeenCalledWith('productions', BigInt(1));
    expect(result).toEqual(mockedProduction);
  });

  it('Deve buscar um pedido por ID com retorno null', async () => {
    const mockedProduction: any = null;

    mockDbConnection.findId.mockResolvedValueOnce(null);

    const result = await productionGateway.findId(BigInt(2));

    expect(mockDbConnection.findId).toHaveBeenCalledWith('productions', BigInt(2));
    expect(result).toEqual(mockedProduction);
  });

  it('Deve buscar todos os pedidos com filtro e com retorno null', async () => {
    const mockedProduction: any = null;

    mockDbConnection.find.mockResolvedValueOnce(null);

    const result = await productionGateway.find({});

    expect(result).toEqual(mockedProduction);
  });

  it('Deve buscar todos os pedidos com filtro', async () => {
    const mockedProduction: Production[] = [new Production(1, '123', '2', 'teste', 'WAITING', '', '')];

    mockDbConnection.find.mockResolvedValueOnce(mockedProduction);

    const result = await productionGateway.find({});

    expect(mockDbConnection.find).toHaveBeenCalledWith('productions', {});
    expect(result).toEqual(mockedProduction);
  });

  it('Deve buscar todos os pedidos e com retorno null', async () => {
    const mockedProduction: any = null;

    mockDbConnection.findAll.mockResolvedValueOnce(mockedProduction);

    const result = await productionGateway.findAll();

    expect(mockDbConnection.findAll).toHaveBeenCalledWith('productions');
    expect(result).toEqual(mockedProduction);
  });

  it('Deve buscar todos os pedidos', async () => {
    const mockedProduction: Production[] = [new Production(1, '123', '2', 'teste', 'WAITING', '', '')];

    mockDbConnection.findAll.mockResolvedValueOnce(mockedProduction);

    const result = await productionGateway.findAll();

    expect(mockDbConnection.findAll).toHaveBeenCalledWith('productions');
    expect(result).toEqual(mockedProduction);
  });

  it('Deve buscar pedidos por referência', async () => {
    const reference = { status: 'WAITING' };
    const mockedProductions: Production[] = [
    ];

    mockDbConnection.find.mockResolvedValueOnce(mockedProductions);

    const result = await productionGateway.find(reference);

    expect(mockDbConnection.find).toHaveBeenCalledWith('productions', reference);
    expect(result).toEqual(mockedProductions);
  });

  it('Deve persistir um novo pedido', async () => {
    const mockedProduction: Production = new Production(1, '123', '2', 'teste', 'WAITING', '', '');

    const orderId = '123';
    const protocol = '2';
    const orderDescription = 'Teste';
    const status = 'WAITING';

    mockDbConnection.persist.mockResolvedValueOnce(mockedProduction);

    const result = await productionGateway.persist(orderId, protocol, orderDescription, status);

    expect(mockDbConnection.persist).toHaveBeenCalledWith('productions', {
      orderId,
      protocol,
      orderDescription,
      status
    });

    expect(result).toEqual(mockedProduction);
  });
});
