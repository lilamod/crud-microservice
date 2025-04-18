import { CreateProductDto } from '@app/libs';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@ApiTags('Products')
@ApiSecurity('x-access-token')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() productDto: CreateProductDto) {
    return this.sendMessage('create_product', productDto);
  }

  @Get()
  async getAllProducts() {
    return this.sendMessage('get_all_products', {});
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.sendMessage('get_product', { id });
  }

  @Patch(':id/stock')
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: CreateProductDto,
  ) {
    return this.sendMessage('update_product', { id, productDto });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.sendMessage('delete_product', { id });
  }

  private async sendMessage(pattern: string, data: any, retries: number = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await lastValueFrom(this.client.send({ cmd: pattern }, data));
        return result;
      } catch (err) {
        if (attempt === retries - 1) {
          throw err; 
        }
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
