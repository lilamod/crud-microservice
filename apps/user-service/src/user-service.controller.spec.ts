import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user-service.service';
import { UserController } from './user-service.controller';

describe('UserServiceController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(), 
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); // ✅ This is a valid test
  });

  // Add more tests here as needed
});
