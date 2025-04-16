import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductServiceService } from './product-service.service';
import { CreateProductDto, Products } from '@app/libs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProductServiceController {
  constructor(private readonly productService: ProductServiceService) {}

  @Get()
  getHello(): string {
    return this.productService.getHello();
  }

  @MessagePattern({ cmd: 'create_product' })
  async createProduct(productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }

  @MessagePattern({ cmd: 'get_all_products' })
  async getAllProducts(body: any) {
    const productDetails = await this.productService.findAll(body)
    if (productDetails.list.length > 0) {
      return productDetails
    } else {
      return [{ list: [], count: 0 }];
    }
  }

  @MessagePattern({ cmd: 'get_product' })
  async getProduct(data: { id: number }) {
    const productDetail = await this.productService.findOne(data.id)
    if (productDetail) {
      return productDetail;
    } else {
      return { message: "Product does not exist" };
    }
  }

  @MessagePattern({ cmd: 'update_product' })
  async updateProduct(data: { id: number; productDto: CreateProductDto }) {
    const productDetail = await this.productService.findOne(data.id)
    if (productDetail) {
      return this.productService.update(data.id, data.productDto);
    } else {
      return { message: "Product does not exist" };
    }
  }

  @MessagePattern({ cmd: 'delete_product' })
  async deleteProduct(data: { id: number }) {
    const productDetail = await this.productService.findOne(data.id);
    if (productDetail) {
      return this.productService.remove(data.id);
    } else {
      return { message: "Product does not exist" };
    }
  }
}
