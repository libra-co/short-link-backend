import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  VisitType,
  VisitorBrowserType,
  VisitorDeviceType,
  VisitorOsType,
} from '../../short-link/short-link.type';

@Entity()
export class VisitRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 15,
    comment: 'visitor ip address',
  })
  ip: string;

  @CreateDateColumn()
  visitTime: Date;

  @Column({
    type: 'enum',
    enum: VisitType,
  })
  visitType: VisitType;

  @Column({
    type: 'enum',
    enum: VisitorDeviceType,
  })
  visitorDeviceType: VisitorDeviceType;

  @Column({
    type: 'enum',
    enum: VisitorBrowserType,
  })
  visitorBrowserType: VisitorBrowserType;

  @Column({
    type: 'enum',
    enum: VisitorOsType,
  })
  visitorOsType: VisitorOsType;

  @Column({
    length: 255,
    comment: 'visitor user agent',
  })
  userAgent: string;

  @Column({
    length: 255,
    comment:
      'visitor referer, where the visitor comes from, direct visit if null',
    nullable: true,
  })
  referer?: string;

  @Column({
    comment: 'visitor country',
    nullable: true,
  })
  country?: string;

  @Column({
    comment: 'visitor province',
    nullable: true,
  })
  province?: string;

  @Column({
    comment: 'visitor city',
    nullable: true,
  })
  city?: string;

  @Column({
    comment: 'related short code id',
  })
  shortCodeId: number;

  @Column({
    comment: 'visitor isp',
    nullable: true,
  })
  isp?: string;
}
