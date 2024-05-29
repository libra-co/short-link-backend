import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { VisitDateRecord } from './entities/visit-date-record.entity';
import { getIsLastDayOfMonth, updateDateRecordData } from './utils';
import dayjs from 'dayjs';

@Injectable()
export class VisitDateRecordService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

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
    const { week, month, year } = recordEntity;
    // Get date, sunday is 0
    const weekDay = dayjs().day();
    // Update year data
    const isLastDayOfMonth = getIsLastDayOfMonth()
    const nowMonth = dayjs().month()
    if(isLastDayOfMonth) {
      // const 
    }
    // Update weekday data
    const updateWeekIndex = weekDay === 0 ? 6 : weekDay - 1; // sunday is at 6 in array
    // Week day is new week,so update a new week
    if (weekDay === 1) {
      const newWeekData = Array(7).fill(0);
      recordEntity.week = updateDateRecordData(newWeekData, updateWeekIndex, dateVisitNumber);
    } else {
      recordEntity.week = updateDateRecordData(week, updateWeekIndex, dateVisitNumber);
    }

    // dateVisitNumber is previous day data,so here need determine whether it is sunday
    if (weekDay === 0) {

    }

  }
}
