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
    return await this.productRepository.save(createProductDto);
  }

  async findAll(body: any): Promise<{ list: Products[]; count: number }> {
    const sort = body.sort || 'crated_at';
    const sortBy = body.sortBy || 'DESC';
    const keyword = body.keyword || '';

    const queryBuilder = this.productRepository
      .createQueryBuilder()
      .where('is_deleted =:isDeleted', { isDeleted: false })
      .orderBy(sort, sortBy);

    const [list, count] = await Promise.all([
      queryBuilder.getRawMany(),
      queryBuilder.getCount(),
    ]);
    return { list, count };
  }

  async findOne(id: number): Promise<Products | null> {
    return await this.productRepository.findOne({
      where: { id: id, is_deleted: false },
    });
  }

  async update(id: number,updateProductDto: UpdateProductDto): Promise<Products | null> {
    await this.productRepository.update(id, updateProductDto);
    return await this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.productRepository.update(id, { is_deleted: true });
    return await this.productRepository.findOne({ where: { id } });
  }
}
