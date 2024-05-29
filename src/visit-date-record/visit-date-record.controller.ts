import { Controller } from '@nestjs/common';
import { VisitDateRecordService } from './visit-date-record.service';

@Controller('visit-date-record')
export class VisitDateRecordController {
  constructor(private readonly visitDateRecordService: VisitDateRecordService) {}

}
