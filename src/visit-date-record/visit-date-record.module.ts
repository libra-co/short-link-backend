import { Module } from '@nestjs/common';
import { VisitDateRecordService } from './visit-date-record.service';
import { VisitDateRecordController } from './visit-date-record.controller';

@Module({
  controllers: [VisitDateRecordController],
  providers: [VisitDateRecordService],
  exports: [VisitDateRecordService]
})
export class VisitDateRecordModule { }
