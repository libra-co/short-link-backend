import { Inject, Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { influxDB_pro } from 'config/database.config';
import { VisitRecordPoint } from './type';

@Injectable()
export class InfluxdbService {
  influxdb: InfluxDB;
  constructor(
    @Inject('INFLUXDB_CLIENT')
    private readonly client: InfluxDB
  ) { }

  writeVisitRecord(data: VisitRecordPoint) {
    const { org, bucket, visitRecordMeasure } = influxDB_pro;
    const point = new Point(visitRecordMeasure)
      .tag('shortCode', data.shortCode)
      .tag('shortCodeId', data.shortCodeId.toString())
      .intField('test', Math.random() * 10)
    const writeClient = this.client.getWriteApi(org, bucket, 's')
    // console.log('point', point)
    writeClient.writePoint(point)
    writeClient.flush(true)

    //   let writeClient = this.client.getWriteApi(org, bucket, 'ns')

    //   for (let i = 0; i < 5; i++) {
    //     let point = new Point('measurement1')
    //       .tag('tagname1', 'tagvalue1')
    //       .intField('field1', i)

    //     void setTimeout(() => {
    //       writeClient.writePoint(point)
    //     }, i * 1000) // separate points by 1 second

    //     void setTimeout(() => {
    //       writeClient.flush()
    //     }, 5000)
    //   }
  }

  findVisitRecord() {
    const { org, bucket, visitRecordMeasure } = influxDB_pro;
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
