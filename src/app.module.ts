import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { database_dev } from '../config/database.config';
import { ShortCodeModule } from './short-link/short-link.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../config/.env'],
      load: [
        () => database_dev, // database configuration
      ],
    }),
    TypeOrmModule.forRoot(database_dev),
    ShortCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
