import * as dayjs from "dayjs";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VisitDateRecord {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    comment: 'related short code id'
  })
  shortCodeId: number;
  @Column({
    length: 10,
    comment: 'related short code'
  })
  shortCode: string;
  @Column({
    length: 255,
    comment: 'record recent week visit record,unit: date, default is Array in json, [Mon, Tues, Wed, Thur, Tir, Sat, Sun]'
  })
  week: string;
  @Column({
    length: 255,
    comment: 'record recent week visit record,unit: week, default is Array in json'
  })
  month: string;
  @Column({
    length: 255,
    comment: 'record recent week visit record,unit: month, default is Array in json'
  })
  year: string;
  @Column({
    type: 'date'
  })
  recordDate: string;
}
