import { Module } from '@nestjs/common';
import { VisitRecordService } from './visit-record.service';
import { VisitRecordController } from './visit-record.controller';
import { ShortCodeModule } from 'src/short-link/short-link.module';
import { HttpModule } from '@nestjs/axios';
import { ShortLinkMapModule } from 'src/short-link-map/short-link-map.module';

@Module({
  imports: [HttpModule, ShortCodeModule, ShortLinkMapModule],
  controllers: [VisitRecordController],
  providers: [VisitRecordService],
})
export class VisitRecordModule { }
