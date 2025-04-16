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
import { firstValueFrom } from 'rxjs';

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

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: CreateProductDto,
  ) {
    return this.sendMessage('update_product', { id, ...productDto });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.sendMessage('delete_product', { id });
  }

  private async sendMessage(pattern: string, data: any) {
    try {
      return await firstValueFrom(this.client.send({ cmd: pattern }, data));
    } catch (error) {
      // Handle error appropriately
      throw new Error(`Error sending message to ${pattern}: ${error.message}`);
    }
  }
}
