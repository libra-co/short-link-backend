import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitRecordDto } from './visit-record.dto';

export class UpdateVisitRecordDto extends PartialType(CreateVisitRecordDto) { }
