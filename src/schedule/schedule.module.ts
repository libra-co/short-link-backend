import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { VisitDateRecordModule } from 'src/visit-date-record/visit-date-record.module';
import { InfluxdbModule } from 'src/influxdb/influxdb.module';

@Module({
  imports: [VisitDateRecordModule, InfluxdbModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule { }
