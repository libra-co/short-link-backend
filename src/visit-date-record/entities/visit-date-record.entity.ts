import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VisitDateRecord {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    comment: 'related short code id'
  })
  shortCodeId: number;
  @Column({
    length: 255,
    comment: 'related short code'
  })
  shortCode: string;
  @Column({
    length: 255,
    default: "[0,0,0,0,0,0,0]",
    comment: 'record recent week visit record,unit: date, default is Array in json, [Mon, Tues, Wed, Thur, Tir, Sat, Sun]'
  })
  week: string;
  @Column({
    length: 255,
    default: "[0,0,0,0,0,0,0]",
    comment: 'record recent week visit record,unit: week, default is Array in json'
  })
  month: string;
  @Column({
    length: 255,
    default: "[0,0,0,0,0,0,0]",
    comment: 'record recent week visit record,unit: month, default is Array in json'
  })
  year: string;
}
