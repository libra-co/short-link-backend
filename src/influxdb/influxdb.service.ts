import { Inject, Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';
import { VisitRecordPoint } from './type';
import { FindShortCodeDataDto } from './dto/influxdb-dto';
import { InfluxDBRangeTypeEnum } from './influxdb.type';
import { ShortCodeTimeDataVo } from './vo/influxdb-vo';
import * as dayjs from 'dayjs';
import * as utcPlugin from 'dayjs/plugin/utc';
import * as timezonePlugin from 'dayjs/plugin/timezone';

@Injectable()
export class InfluxdbService {
  influxdb: InfluxDB;
  constructor(
    @Inject('INFLUXDB_CLIENT') private readonly client: InfluxDB,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) { }

  writeVisitRecord(data: VisitRecordPoint) {
    const { org, bucket, visitRecordMeasure } = this.configService.get('influxDBConfig');
    const { shortCode, shortCodeId, dateVisitNumber } = data;
    const point = new Point(visitRecordMeasure)
      .tag('shortCode', shortCode)
      .tag('shortCodeId', shortCodeId.toString())
      .intField('dateVisitNumber', dateVisitNumber)
      .booleanField('isDeleted', false);
    const writeClient = this.client.getWriteApi(org, bucket, 's');
    writeClient.writePoint(point);
    writeClient.flush(true);
  }

  /**
   * when find record, need filter deleted record!
   */
  async findVisitRecord({ rangeType, shortCodeId }: FindShortCodeDataDto): Promise<ShortCodeTimeDataVo[]> {
    dayjs.extend(utcPlugin);
    dayjs.extend(timezonePlugin);
    rangeType = InfluxDBRangeTypeEnum[rangeType];
    const { org, bucket, visitRecordMeasure } = this.configService.get('influxDBConfig');
    let queryClient = this.client.getQueryApi(org);

    let fluxQuery =
      `
      from(bucket: "${bucket}")
      |> range(start: -${rangeType})
      |> filter(fn: (r) => r._measurement == "${visitRecordMeasure}"
      ${shortCodeId ? `and r.shortCodeId == "${shortCodeId}"` : ""}
      )
      |> aggregateWindow(every: 1d, fn: sum)
      `;

    console.log('fluxQuery', fluxQuery);

    return new Promise((resolve, reject) => {
      const result = [];

      queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          const { _time, _value, shortCodeId } = tableObject;
          const chinaTime = dayjs.utc(_time).tz('Asia/Shanghai').format('YYYY-MM-DD');
          const dateData = {
            value: _value || 0,
            time: chinaTime,
            shortCodeId
          };
          result.push(dateData);
        },
        error: (error) => {
          reject(result);
          console.error('\nError', error);
        },
        complete: () => {
          resolve(result);
          console.log('\nSuccess');
        },
      });
    });


  }


}
