import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { VisitDateRecord } from './entities/visit-date-record.entity';
import { generateShortCodeRecordRedisKey, getIsFirstDayOfMonth, updateRecordData } from './utils';
import * as dayjs from 'dayjs';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RedisShortVisitRecordDay, RedisShortVisitRecordMonth, RedisShortVisitRecordWeek, RedisShortVisitRecordYear } from '../common/consts/redis';

@Injectable()
export class VisitDateRecordService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  @InjectRedis()
  private readonly redis: Redis;

  /**
   * 
   * @param shortCodeId short code id
   * @param dateVisitNumber dateVisitNumber async from redis,saved previous day visit number
   * @returns 
   */
  async updateRecordInMysql(shortCodeId: number, shortCode: string, dateVisitNumber: number) {

    // insert previous day from here
    const previousDay = dayjs().subtract(1, 'day');
    const insertDate = previousDay.date() - 1; // 1st index is 0
    const insertDay = previousDay.day();
    const insertMonth = previousDay.month();
    let recordEntity = await this.entityManager.findOneBy(VisitDateRecord, { id: shortCodeId });
    if (!recordEntity) {
      recordEntity = new VisitDateRecord()
      recordEntity.shortCodeId = shortCodeId
      recordEntity.shortCode = shortCode
      recordEntity.recordDate = previousDay.format('YYYY-MM-DD')
    }

    // Only record the data for the current year
    if (insertMonth === 11 && insertDate === 31) return;

    const lastDayOfMonth = previousDay.endOf('month').date();
    console.log('lastDayOfMonth', lastDayOfMonth)
    const {
      week = Array(7).fill(0),
      month = Array(lastDayOfMonth - 1).fill(0),
      year = Array(12).fill(0),
    } = recordEntity;
    console.log('month', month, month.length)
    // Update year data
    recordEntity.year = updateRecordData(year, insertMonth, dateVisitNumber);
    // Update month data
    recordEntity.month = updateRecordData(month, insertDate, dateVisitNumber);
    // Update week data
    // Get date, sunday is 0
    const updateWeekIndex = insertDay === 0 ? 6 : insertDay - 1; // sunday is at 6 in array
    // New week, start a new week
    if (insertDay === 1) {
      const newWeekData = Array(7).fill(0);
      recordEntity.week = updateRecordData(newWeekData, updateWeekIndex, dateVisitNumber);
    } else {
      recordEntity.week = updateRecordData(week, updateWeekIndex, dateVisitNumber);
    }
    await this.entityManager.save(recordEntity)
  }

  async recordVisitInRedis(shortCodeId: number, shortCode: string) {
    const redisMemberKey = generateShortCodeRecordRedisKey(shortCodeId, shortCode)
    // Find data
    const findPipeline = this.redis.pipeline();
    let dayScore, weekScore, monthScore, yearScore;
    findPipeline.zscore(RedisShortVisitRecordDay, redisMemberKey, (_, res) => { dayScore = parseInt(res) || 0; });
    findPipeline.zscore(RedisShortVisitRecordWeek, redisMemberKey, (_, res) => { weekScore = parseInt(res) || 0; });
    findPipeline.zscore(RedisShortVisitRecordMonth, redisMemberKey, (_, res) => { monthScore = parseInt(res) || 0; });
    findPipeline.zscore(RedisShortVisitRecordYear, redisMemberKey, (_, res) => { yearScore = parseInt(res) || 0; });
    await findPipeline.exec();
    // Insert data
    const insertPipeline = this.redis.pipeline();
    insertPipeline.zadd(RedisShortVisitRecordDay, dayScore + 1, redisMemberKey);
    insertPipeline.zadd(RedisShortVisitRecordWeek, weekScore + 1, redisMemberKey);
    insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, redisMemberKey);
    insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, redisMemberKey);
    await insertPipeline.exec();
  }

}
