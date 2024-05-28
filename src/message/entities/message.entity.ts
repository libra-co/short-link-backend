import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MessageReadStatusEnum, MessageTypeEnum } from "../message.type";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    comment: 'link record id',
  })
  linkRecordId: number;

  @Column({
    type: 'int',
    comment: 'short code id',
  })
  shortCodeId: number;

  @Column({
    length: 10,
    comment: 'short code',
  })
  shortCode: string;

  @Column({
    type: 'int',
    default: MessageReadStatusEnum.Unread,
    comment: '0 - unread, 1 -read'
  })
  read: MessageReadStatusEnum;

  @Column({
    type: 'int',
    comment: '0 - Expired, 1 - LimitAttached, 2 - OutOfVisitLimit, 3 - UrlAvailable'
  })
  type: MessageTypeEnum;

  @CreateDateColumn()
  createTime: Date;

  @Column({
    length: 255,
  })
  content: string;
}
