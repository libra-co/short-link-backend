import { VisitRecord } from './entities/link-record.entity';

export type CreateVisitRecordParams = Omit<
  VisitRecord,
  'id' | 'visitTime' | 'visitType'
>;

export enum UrlAccessStatusEnum {
  SUCCESS = 0,
  FAIL = 1,
}
