import { CreateProductDto, Products, UpdateProductDto } from '@app/libs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductServiceService {
  constructor(
    @InjectRepository(Products) private productRepository: Repository<Products>,
  ) {}


  getHello(): string {
    return 'Hello World!';
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const product = this.productRepository.create(createProductDto)
    if (product) {
      await this.productRepository.insert(product);
      return product;
    }
    return this.productRepository.save(createProductDto);
  }

  async findAll(body: any): Promise<{ list: Products[], count: number }> {
    const sort = body.sort || "crated_at";
    const sortBy = body.sortBy || "DESC";

    const queryBuilder = this.productRepository
      .createQueryBuilder('test_products')
      .select(['test_products.*', 'test_users.name AS user_name'])
      .where('test_products.is_deleted =:isDeleted', { isDeleted: false })
      .leftJoin('test_users', 'test_users', 'test_products.user_id = test_users.id')
      .orderBy(sort, sortBy);

    const [list, count] = await Promise.all([
      queryBuilder.getRawMany(),
      queryBuilder.getCount()
    ])
    return { list, count };
  }

  async findOne(id: number): Promise<Products | null> {
    return await this.productWithJoin(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Products | null> {
    await this.productRepository.update(id, updateProductDto);
    return await this.productWithJoin(id);
  };

  async remove(id: number) {
    await this.productRepository.update(id, { is_deleted: true });
    return await this.productWithJoin(id);
  };

  async productWithJoin(id: number) {
    return await this.productRepository.createQueryBuilder('test_products')
      .select(['test_products.*', 'test_users.name AS user_name'])
      .where('test_products.is_deleted =:isDeleted', { isDeleted: false })
      .andWhere('test_products.id =:id', { id })
      .leftJoin('test_users', 'test_users', 'test_products.user_id = test_users.id')
      .getRawOne()

  }
}
