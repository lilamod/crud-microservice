import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Get()
  getApiInfo() {
    return {
      message: 'Welcome to the API Gateway!',
      routes: {
        auth: '/auth',
        users: '/users',
        products: '/products',
      },
    };
  }
}
