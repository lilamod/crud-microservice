import { Module } from '@nestjs/common';
import { ProductServiceController } from './product-service.controller';
import { ProductServiceService } from './product-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Products } from '@app/libs';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Products]), DatabaseModule,ConfigService],
  controllers: [ProductServiceController],
  providers: [ProductServiceService, ConfigService],
})
export class ProductServiceModule {}
