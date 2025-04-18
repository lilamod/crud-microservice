import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Users } from './entity/user.entity';
import { Session } from './entity/session.entity';
import { Products } from './entity/product.entity';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.DATABASE_HOST}`,
      port: +`${process.env.DATABASE_PORT}`,
      username: `${process.env.DATABASE_USER}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      entities: [Users, Session, Products],
    }),
  ],
})
export class DatabaseModule { }
