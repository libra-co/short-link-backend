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

export const database_pro: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: '123456789',
  database: 'short-url',
  poolSize: 10,
  connectorPackage: 'mysql2',
  synchronize: true,
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  extra: {
    // authPlugin: 'sha256_password', // for mysql 8.0
  },
};
export const database_server: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'short_link',
  password: '8H6SSnGd4NRGMSks',
  database: 'short_link',
  poolSize: 10,
  connectorPackage: 'mysql2',
  synchronize: true,
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  extra: {
    // authPlugin: 'sha256_password', // for mysql 8.0
  },
};

export const redisConfig: RedisModuleOptions = {
  type: 'single',
  url: 'redis://localhost:6379'
};

export const influxDB_pro = {
  url: 'http://localhost:8086',
  token: "5Gav8xo_WWNQDV7YLBJvUKyA0fou7qkhQcEArjtbwJL0H4JkCOv9Db5T0Fa2xAhofs_IKVmXEM7AerlB6POJbg==",
  // token: "fSvqSqn-ox6juG4OznFLEem7zMac6MnX8lyP03-0nVdsRMs_4hLkvNCVV-rcNtydDu_Or0uHh-w2DJ1yqNV70A==",  // work through token
  org: "short_link",
  bucket: "short_code",
  visitRecordMeasure: "short_code",
}

export const influxDBConfig = {
  url: 'http://localhost:8086',
  token: "QGg7vF_iBU_v29wsI5XXtvb3MVraLUP-Klx-Hh8WGnM5WgRKKos0yGXyz-wiWxZ4Y15Xtlbwpf8QfGifOyjoTQ==",
  org: "short_link",
  bucket: "short_link",
  visitRecordMeasure: "short_link",
}
