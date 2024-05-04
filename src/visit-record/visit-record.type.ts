import { VisitRecord } from './entities/link-record.entity';

export type CreateVisitRecordParams = Omit<
  VisitRecord,
  'id' | 'visitTime' | 'visitType'
>;
