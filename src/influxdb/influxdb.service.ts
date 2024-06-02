import { Inject, Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';
import { VisitRecordPoint } from './type';

@Injectable()
export class InfluxdbService {
  influxdb: InfluxDB;
  constructor(
    @Inject('INFLUXDB_CLIENT') private readonly client: InfluxDB,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) { }

  writeVisitRecord(data: VisitRecordPoint) {
    const { org, bucket, visitRecordMeasure } = this.configService.get('influxDBConfig');
    const { shortCode, shortCodeId, dateVisitNumber } = data
    const point = new Point(visitRecordMeasure)
      .tag('shortCode', shortCode)
      .tag('shortCodeId', shortCodeId.toString())
      .intField('dateVisitNumber', dateVisitNumber)
    const writeClient = this.client.getWriteApi(org, bucket, 'ns')
    writeClient.writePoint(point)
    writeClient.flush(true)
  }

  findVisitRecord() {
    const { org, bucket, visitRecordMeasure } = this.configService.get('influxDBConfig');
    let queryClient = this.client.getQueryApi(org)
    let fluxQuery =
      `
    from(bucket: "${bucket}")
     |> range(start: -10h)
     |> filter(fn: (r) => r._measurement == "${visitRecordMeasure}")
    `
    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row)
        console.log(tableObject)
      },
      error: (error) => {
        console.error('\nError', error)
      },
      complete: () => {
        console.log('\nSuccess')
      },
    })
  }

}
