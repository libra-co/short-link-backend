import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
