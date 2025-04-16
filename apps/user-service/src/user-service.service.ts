import { CreateUserDto, UpdateUserDto, Users } from '@app/libs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    try {
      await this.userRepository.insert(user);
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findAll(body: any): Promise<{ list: Users[]; count: number }> {
    const sort = body.sort || 'created_at';
    const sortBy = body.sortBy || 'DESC';
    const keyword = body.search || '';

    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .where('is_deleted =: isDeleted', { isDeleted: false })
      .andWhere('users.name ilike :query OR users.email ilike :query', {
        query: `%${keyword}%`,
      })
      .orderBy(sort, sortBy);

    const [users, count] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);
    return { list: users, count };
  }

  async findOne(id: number): Promise<Users | null> {
    return await this.userRepository.findOne({
      where: { id: id, is_deleted: false },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Users | null> {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.userRepository.update(id, { is_deleted: true });
  }

  async userExist(field: string, value: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        [field]: value,
        is_deleted: false,
      },
    });
    return !!user;
  }
}
