import { Module, Session } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Users } from '@app/libs';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Session]),
    DatabaseModule,
    ConfigService,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, ConfigService],
})
export class AuthServiceModule {}
