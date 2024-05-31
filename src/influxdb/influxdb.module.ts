import { Module } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { InfluxdbService } from './influxdb.service';
import { InfluxdbController } from './influxdb.controller';
import { influxDB_pro } from 'config/database.config';

@Module({
  controllers: [InfluxdbController],
  providers: [
    InfluxdbService,
    {
      provide: 'INFLUXDB_CLIENT',
      useFactory() {
        const { url, token } = influxDB_pro;
        const client = new InfluxDB({ url, token })
        return client;
      }
    }
  ],
  exports: [InfluxdbService],
})
export class InfluxdbModule { }
