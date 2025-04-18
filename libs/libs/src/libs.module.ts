import { Module } from '@nestjs/common';
import { LibsService } from './libs.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import typeormConfig from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<DataSourceOptions>('typeorm');
        if (!config) {
          throw new Error('TypeORM configuration not found!');
        }
        return config;
      },
    }),
    ],
      providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
