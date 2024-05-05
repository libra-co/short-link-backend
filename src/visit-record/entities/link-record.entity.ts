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
    type: 'int',
    comment: '0 - first visit, 1 - repeat visit',
  })
  visitType: VisitType;

  @Column({
    type: 'int',
    comment: '0 - PC, 1 - mobile',
  })
  visitorDeviceType: VisitorDeviceType;

  @Column({
    type: 'int',
    comment:
      '0 - unknown, 1 - chrome, 2 - firefox, 3 - safari, 4 - edge, 5 - ie',
  })
  visitorBrowserType: VisitorBrowserType;

  @Column({
    type: 'int',
    comment:
      '0 - unknown, 1 - windows, 2 - mac, 3 - ios, 4 - android, 5 - linux',
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
