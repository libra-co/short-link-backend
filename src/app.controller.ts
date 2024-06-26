import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortCodeService } from './short-link/short-link.service';
import { ShortLinkMapService } from './short-link-map/short-link-map.service';
import { VisitDateRecordController } from './visit-date-record/visit-date-record.controller';
import { VisitDateRecordService } from './visit-date-record/visit-date-record.service';
import * as dayjs from 'dayjs';
import { RedisShortVisitRecordDay, RedisShortVisitRecordMonth, RedisShortVisitRecordWeek, RedisShortVisitRecordYear } from './common/consts/redis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { InfluxdbService } from './influxdb/influxdb.service';
import { generateMemberList } from './schedule/utils';

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
    @InjectRedis()
    private readonly redis: Redis,
    @Inject(InfluxdbService)
    private readonly influxdbService: InfluxdbService,
  ) { }
  @Get('test')
  async test() {
    const res = await this.redis.zrange(RedisShortVisitRecordDay, 0, -1, 'WITHSCORES')
    const visitDailyRecord = generateMemberList(res);
    console.log('visitDailyRecord', visitDailyRecord)
    // const shortCodeId = 12
    // const findPipeline = this.redis.pipeline();
    // let dayScore, weekScore, monthScore, yearScore;
    // findPipeline.zscore(RedisShortVisitRecordDay, shortCodeId, (_, res) => { dayScore = parseInt(res); });
    // findPipeline.zscore(RedisShortVisitRecordWeek, shortCodeId, (_, res) => { weekScore = parseInt(res); });
    // findPipeline.zscore(RedisShortVisitRecordMonth, shortCodeId, (_, res) => { monthScore = parseInt(res); });
    // findPipeline.zscore(RedisShortVisitRecordYear, shortCodeId, (_, res) => { yearScore = parseInt(res); });
    // await findPipeline.exec();
    // const insertPipeline = this.redis.pipeline();
    // if (!yearScore) {
    //   insertPipeline.zadd(RedisShortVisitRecordYear, 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordMonth, 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordWeek, 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    // } else if (!monthScore) {
    //   insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordMonth, 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordWeek, 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    // } else if (!weekScore) {
    //   insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordWeek, 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    // } else if (!dayScore) {
    //   insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordWeek, weekScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    // } else {
    //   insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordWeek, weekScore + 1, shortCodeId);
    //   insertPipeline.zadd(RedisShortVisitRecordDay, dayScore + 1, shortCodeId);
    // }
    // const pipelineResult = await insertPipeline.exec();
    // this.influxdbService.writeVisitRecord({ shortCode: `test${1}`, shortCodeId: 1 })
    // this.influxdbService.findVisitRecord()
  }
}
