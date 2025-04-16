import { Module } from '@nestjs/common';
import { UserController } from './user-service.controller';
import { UserService } from './user-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Users } from '@app/libs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Users]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService],
})
export class UserModule {}
