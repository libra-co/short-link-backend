import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShortCodeStatus } from './short-link.type';

@Entity()
export class ShortCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    comment: '短链',
  })
  shortCode: string;

  @Column({
    type: 'enum',
    enum: ShortCodeStatus,
    default: ShortCodeStatus.ENABLE,
    comment: '启用状态， 已使用',
  })
  status: ShortCodeStatus;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
