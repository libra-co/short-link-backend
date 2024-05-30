import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { database_dev, database_pro, database_server, redis_dev } from '../config/database.config';
import { ShortCodeModule } from './short-link/short-link.module';
import { ShortLinkMapModule } from './short-link-map/short-link-map.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VisitRecordModule } from './visit-record/visit-record.module';
import { MessageModule } from './message/message.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { VisitDateRecordModule } from './visit-date-record/visit-date-record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../config/.env'],
      load: [
        () => database_dev, // database configuration
      ],
    }),
    // TypeOrmModule.forRoot(database_dev),
    TypeOrmModule.forRoot(database_pro),
    // TypeOrmModule.forRoot(database_server),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/middle-page'),
      exclude: ['/api/(.*)', '/direct/(.*)'],
    }),
    RedisModule.forRoot(redis_dev),
    ShortCodeModule,
    ShortLinkMapModule,
    VisitRecordModule,
    MessageModule,
    VisitDateRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
