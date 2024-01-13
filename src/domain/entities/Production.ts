/* eslint-disable @typescript-eslint/naming-convention */
export class Production {
  private readonly _id: any;
  private readonly _orderId: string;
  private readonly _protocol: string;
  private readonly _orderDescription: string;
  private readonly _status: string;
  private readonly _created_at: Date;
  private readonly _updated_at: Date;

  constructor (
    id: any,
    orderId: string | null,
    protocol: string | null,
    orderDescription: string | null,
    status: string,
    created_at: any,
    updated_at: any
  ) {
    this._id = id;
    this._orderId = orderId ?? '';
    this._protocol = protocol ?? '';
    this._orderDescription = orderDescription ?? '';
    this._status = status ?? '';
    this._created_at = created_at ?? '';
    this._updated_at = updated_at ?? '';
  }

  get orderId (): string {
    return this._orderId;
  }

  get id (): bigint {
    return this._id;
  }

  get protocol (): string {
    return this._protocol;
  }

  get orderDescription (): string {
    return this._orderDescription;
  }

  get status (): string {
    return this._status;
  }

  get statusCheck (): boolean {
    return [
      'WAITING', // WAITING
      'IN_PROGRESS', // IN_PROGRESS
      'FINISH', // FINISH
      'DONE' // DONE
    ].includes(this.status);
  }

  get created_at (): Date {
    return this._created_at;
  }

  get updated_at (): Date {
    return this._updated_at;
  }
}
