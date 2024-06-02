import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisShortVisitRecordDay } from 'src/visit-date-record/const';
import { generateMemberList } from './utils';
import { VisitDateRecordService } from 'src/visit-date-record/visit-date-record.service';
import { InfluxdbService } from 'src/influxdb/influxdb.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  @InjectRedis()
  private readonly redis: Redis;
  @Inject(VisitDateRecordService)
  private readonly visitDateRecordService: VisitDateRecordService;
  @Inject(InfluxdbService)
  private readonly influxdbService: InfluxdbService;

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateVisitRecordTask() {
    const res = await this.redis.zrange(RedisShortVisitRecordDay, 0, -1, 'WITHSCORES')
    const visitDailyRecordList = generateMemberList(res);
    // async to mysql
    visitDailyRecordList.forEach(item => this.visitDateRecordService.updateRecordInMysql(item.shortCodeId, item.shortCode, item.dateVisitNumber))
    // async to influxDB
    visitDailyRecordList.forEach(item => this.influxdbService.writeVisitRecord(item))
  }
}
