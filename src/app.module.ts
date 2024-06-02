import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ServeStaticModule } from '@nestjs/serve-static';
import { mysqlConfig, redisConfig, influxDBConfig } from '../config/database.config';
import { ShortCodeModule } from './short-link/short-link.module';
import { ShortLinkMapModule } from './short-link-map/short-link-map.module';
import { join } from 'path';
import { VisitRecordModule } from './visit-record/visit-record.module';
import { MessageModule } from './message/message.module';
import { VisitDateRecordModule } from './visit-date-record/visit-date-record.module';
import { InfluxdbModule } from './influxdb/influxdb.module';
import { ScheduleModule } from './schedule/schedule.module';
import { commonConfig } from 'config/common'

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [],
      load: [
        () => ({
          mysqlConfig,  // mysql database configuration
          influxDBConfig,  // influxDB configuration
          redisConfig,  // redis configuration
          commonConfig,  // env configuration 
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('mysqlConfig')
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/middle-page'),
      exclude: ['/api/(.*)', '/direct/(.*)'],
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redisConfig')
    }),
    ShortCodeModule,
    ShortLinkMapModule,
    VisitRecordModule,
    MessageModule,
    VisitDateRecordModule,
    InfluxdbModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
