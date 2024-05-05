import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SharePrivateStatus, ShortCodeStatus } from '../short-link.type';

@Entity()
export class ShortCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 6,
    comment: 'short code',
  })
  shortCode: string;

  @Column({
    type: 'int',
    default: ShortCodeStatus.ENABLE,
    comment: '0 - unoccupied, 1 - occupied',
  })
  status: ShortCodeStatus;

  @Column({
    type: 'int',
    default: SharePrivateStatus.PUBLIC,
    comment:
      '0 - public, 1 - private, default is public.If it is private, you need set password to access the link.',
  })
  privateShare: SharePrivateStatus;

  @Column({
    nullable: true,
    comment: 'private share link prompt',
  })
  privateSharePrompt: string;

  @Column({
    type: 'varchar',
    length: 18,
    nullable: true,
    comment: 'password for private share',
  })
  privateSharePassword: string;

  @Column({
    default: -1,
    comment:
      'visit limitation,if it is -1, it means no limitation, when it is greater than 0, it means the limitation of visit times',
  })
  visitLimit: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
