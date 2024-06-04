import { Module } from '@nestjs/common';
import { InfluxDB } from '@influxdata/influxdb-client';
import { InfluxdbService } from './influxdb.service';
import { InfluxdbController } from './influxdb.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [InfluxdbController],
  providers: [
    InfluxdbService,
    {
      provide: 'INFLUXDB_CLIENT',
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const { url, token } = configService.get('influxDBConfig');
        const client = new InfluxDB({ url, token })
        return client;
      }
    }
  ],
  exports: [InfluxdbService],
})

export class InfluxdbModule { }
