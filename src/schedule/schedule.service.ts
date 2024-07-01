import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import dayjs from 'dayjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateMemberList } from './utils';
import { VisitDateRecordService } from 'src/visit-date-record/visit-date-record.service';
import { InfluxdbService } from 'src/influxdb/influxdb.service';
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
    const isMonday = dayjs().day() === 1;
    const isFirstDayOfMonth = dayjs().date() === 1;
    const isFirstDayOfYear = dayjs().month() === 0;

    if (isMonday) {
      await this.redis.hdel(RedisVisitStatistics, 'week');
    }

    if (isFirstDayOfMonth) {
      await this.redis.hdel(RedisVisitStatistics, 'month');
    }

    if (isFirstDayOfYear) {
      await this.redis.hdel(RedisVisitStatistics, 'year');
      await this.redis.hdel(RedisVisitStatistics, 'month');
    }

    const visitDailyRecordList = generateMemberList(res);
    // async to mysql
    visitDailyRecordList.forEach(item => this.visitDateRecordService.updateRecordInMysql(item.shortCodeId, item.shortCode, item.dateVisitNumber));
    // async to influxDB
    visitDailyRecordList.forEach(item => this.influxdbService.writeVisitRecord(item));
  }
}
