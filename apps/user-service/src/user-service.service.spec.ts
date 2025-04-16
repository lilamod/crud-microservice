import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, Users } from '@app/libs';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<Users>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(Users));
  });

  describe('create()', () => {
    it('should create and insert a new user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test',
        password: 'Test!123',
        salt: '123311',
        is_deleted: false,
        created_at: new Date(),
        update_at: new Date(),
      };

      const userEntity = { id: 1, ...dto };

      repository.create.mockReturnValue(userEntity as any);
      repository.insert.mockResolvedValue({
        identifiers: [{ id: 1 }],
        generatedMaps: [],
        raw: [],
      });

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.insert).toHaveBeenCalledWith(userEntity);
      expect(result).toEqual(userEntity);
    });
  });

  describe('userExist()', () => {
    it('should return true if user with email exists', async () => {
      repository.findOne.mockResolvedValue({ email: 'test@example.com' } as Users);

      const exists = await service.userExist('email', 'test@example.com');
      expect(exists).toBe(true);  // Expect true because the mock resolves with a user
    });

    it('should return false if user with phone does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      const exists = await service.userExist('phone', '0000000000');
      expect(exists).toBe(false);  
    });
  });
});
