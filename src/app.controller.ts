import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortCodeService } from './short-link/short-link.service';
import { ShortLinkMapService } from './short-link-map/short-link-map.service';
import { VisitDateRecordController } from './visit-date-record/visit-date-record.controller';
import { VisitDateRecordService } from './visit-date-record/visit-date-record.service';
import * as dayjs from 'dayjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ShortCodeService)
    private readonly shortCodeService: ShortCodeService,
    @Inject(ShortLinkMapService)
    private readonly shortLinkMapService: ShortLinkMapService,
    @Inject(VisitDateRecordService)
    private readonly visitDateRecordService: VisitDateRecordService,

  ) { }
  @Get('test')
  async test() {
  // 获取今天的日期
  const today = dayjs();

  // 获取本月最后一天的日期
  const lastDayOfMonth = today.endOf('month');

  // 判断今天是否为本月最后一天
  const isLastDayOfMonth = today.isSame(lastDayOfMonth, 'day');
  console.log('isLastDayOfMonth', isLastDayOfMonth);
  }
}
