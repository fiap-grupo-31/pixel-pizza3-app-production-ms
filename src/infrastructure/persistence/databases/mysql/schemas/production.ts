import { Table, Column, Model, PrimaryKey, DataType, Default, UpdatedAt } from 'sequelize-typescript';

enum StatusEnum {
  RECEIVE = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISH = 'FINISH',
  DONE = 'DONE',
}

@Table
class Production extends Model<Production> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true
  })
    id!: bigint;

  @Column
    orderId!: string;

  @Column
    protocol!: bigint;

  @Column({
    type: DataType.TEXT('long')
  })
    orderDescription!: string

  @Column({
    type: DataType.ENUM(...Object.values(StatusEnum)),
    allowNull: false
  })
    status!: StatusEnum

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
    createdAt!: Date;

  @UpdatedAt
  @Column
    updatedAt!: Date;
}

export { Production };
