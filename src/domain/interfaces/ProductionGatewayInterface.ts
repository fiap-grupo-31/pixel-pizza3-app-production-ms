import { type Production } from 'src/domain/entities/Production';

interface ProductionGatewayInterface {
  findId: (id: bigint) => Promise<Production | null>
  find: (Reference: Record<string, any>) => Promise<Production[] | null>
  findAll: () => Promise<Production[] | null>
  persist: (
    orderId: string,
    protocol: string,
    orderDescription: string,
    status: string
  ) => Promise<any>
  update: (
    id: bigint,
    status: string
  ) => Promise<any>
}

export type { ProductionGatewayInterface }
