import { type ParametroBd } from '@types';

export interface DbConnection {
  findId: (Schema: string, Id: bigint) => Promise<any>
  find: (Schema: string, Reference: Record<string, any>) => Promise<any[]>
  remove: (Schema: string, Id: bigint) => Promise<any>
  removeFind: (Schema: string, Reference: Record<string, any>) => Promise<any>
  findAll: (Schema: string) => Promise<any[]>
  persist: (Schema: string, parametros: ParametroBd[] | Object) => Promise<any>
  update: (Schema: string, Id: bigint, parametros: ParametroBd[] | Object) => Promise<any>
}
