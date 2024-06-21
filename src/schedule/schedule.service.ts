import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { generateMemberList } from './utils';
import { VisitDateRecordService } from 'src/visit-date-record/visit-date-record.service';
import { InfluxdbService } from 'src/influxdb/influxdb.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisShortVisitRecordDay, RedisVisitStatistics } from 'src/common/const/redis';

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
    const res = await this.redis.zrange(RedisShortVisitRecordDay, 0, -1, 'WITHSCORES');
    const yesterdayVisitCount = await this.redis.hget(RedisVisitStatistics, 'day');
    // Clear the daily data in redis
    await this.redis.del(RedisShortVisitRecordDay);
    await this.redis.hdel(RedisVisitStatistics, 'day');
    const visitDailyRecordList = generateMemberList(res);
    // async to mysql
    visitDailyRecordList.forEach(item => this.visitDateRecordService.updateRecordInMysql(item.shortCodeId, item.shortCode, item.dateVisitNumber));
    // async to influxDB
    this.influxdbService.writeVisitRecord({ shortCode: 'total', shortCodeId: -1, dateVisitNumber: +yesterdayVisitCount });
    visitDailyRecordList.forEach(item => this.influxdbService.writeVisitRecord(item));
  }
}
