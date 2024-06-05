import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const mysqlConfig:TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  logging: true,
  synchronize: true,
  database: 'short-url',
  poolSize: 10,
  connectorPackage: 'mysql2',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
}

export const database_dev: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  logging: true,
  synchronize: true,
  database: 'short-url',
  poolSize: 10,
  connectorPackage: 'mysql2',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
};

export const redisConfig: RedisModuleOptions = {
  type: 'single',
  url: 'redis://localhost:6379'
};

export const influxDB_pro = {
  url: 'http://localhost:8086',
  token: "***",
  org: "short_link",
  bucket: "short_link",
  visitRecordMeasure: "short_link",
}
