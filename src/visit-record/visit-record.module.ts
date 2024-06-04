import { Module } from '@nestjs/common';
import { VisitRecordService } from './visit-record.service';
import { VisitRecordController } from './visit-record.controller';
import { ShortCodeModule } from 'src/short-link/short-link.module';
import { HttpModule } from '@nestjs/axios';
import { ShortLinkMapModule } from 'src/short-link-map/short-link-map.module';
import { MessageModule } from 'src/message/message.module';
import { VisitDateRecordModule } from 'src/visit-date-record/visit-date-record.module';

@Module({
  imports: [HttpModule, ShortCodeModule, ShortLinkMapModule, MessageModule, VisitDateRecordModule],
  controllers: [VisitRecordController],
  providers: [VisitRecordService],
})
export class VisitRecordModule { }
