import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitDateRecordDto } from './create-visit-date-record.dto';

export class UpdateVisitDateRecordDto extends PartialType(CreateVisitDateRecordDto) {}
