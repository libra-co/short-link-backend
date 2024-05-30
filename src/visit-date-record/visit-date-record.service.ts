import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { VisitDateRecord } from './entities/visit-date-record.entity';
import { getIsFirstDayOfMonth, updateRecordData } from './utils';
import dayjs from 'dayjs';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RedisShortVisitRecordDay, RedisShortVisitRecordMonth, RedisShortVisitRecordWeek, RedisShortVisitRecordYear } from './const';

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
  async updateRecord(shortCodeId: number, dateVisitNumber: number) {
    const recordEntity = await this.entityManager.findOneBy(VisitDateRecord, { shortCodeId });
    if (!recordEntity) {
      console.error('record date visit record not found!');
      return;
    }
    // insert previous day from here
    const previousDay = dayjs().subtract(1, 'day');
    const insertDate = previousDay.date();
    const insertDay = previousDay.day();
    const insertMonth = previousDay.month();

    // Only record the data for the current year
    if (insertMonth === 11 && insertDate === 31) return;

    const lastDayOfMonth = previousDay.endOf('month').date();
    const {
      week = Array(7).fill(0),
      month = Array(lastDayOfMonth).fill(0),
      year = Array(12).fill(0),
    } = recordEntity;

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
  }

  async updateRecordInRedis(shortCodeId: number) {
    const findPipeline = this.redis.pipeline();
    let dayScore, weekScore, monthScore, yearScore;
    findPipeline.zscore(RedisShortVisitRecordDay, shortCodeId, (_, res) => { yearScore = parseInt(res); });
    findPipeline.zscore(RedisShortVisitRecordWeek, shortCodeId, (_, res) => { weekScore = parseInt(res); });
    findPipeline.zscore(RedisShortVisitRecordMonth, shortCodeId, (_, res) => { monthScore = parseInt(res); });
    findPipeline.zscore(RedisShortVisitRecordYear, shortCodeId, (_, res) => { yearScore = parseInt(res); });
    await findPipeline.exec();
    const insertPipeline = this.redis.pipeline();
    if (!yearScore) {
      insertPipeline.zadd(RedisShortVisitRecordYear, 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordMonth, 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordWeek, 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    } else if (!monthScore) {
      insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordMonth, 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordWeek, 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    } else if (!weekScore) {
      insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordWeek, 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    } else if (!dayScore) {
      insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordWeek, weekScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordDay, 1, shortCodeId);
    } else {
      insertPipeline.zadd(RedisShortVisitRecordYear, yearScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordMonth, monthScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordWeek, weekScore + 1, shortCodeId);
      insertPipeline.zadd(RedisShortVisitRecordDay, dayScore + 1, shortCodeId);
    }
    console.log()
    const pipelineResult = await insertPipeline.exec();

  }

}
