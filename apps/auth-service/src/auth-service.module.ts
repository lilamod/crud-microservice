import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Session, Users } from '@app/libs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Session]),
    DatabaseModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
