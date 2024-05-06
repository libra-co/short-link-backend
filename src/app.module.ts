import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { database_dev, database_pro } from '../config/database.config';
import { ShortCodeModule } from './short-link/short-link.module';
import { ShortLinkMapModule } from './short-link-map/short-link-map.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VisitRecordModule } from './visit-record/visit-record.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/middle-page'),
      exclude: ['/api/(.*)', '/direct/(.*)'],
    }),
    ShortCodeModule,
    ShortLinkMapModule,
    VisitRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
