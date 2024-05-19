import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserDto } from '../dtos';
import { UserService } from '../services';
import { ResponseFormat } from 'src/shared';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create and return a success response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '12345',
      };
      const createdUser = { id: 1, ...createUserDto };

      mockUserService.create.mockResolvedValue(createdUser);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await userController.create(mockResponse, createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        createdUser,
        'User created successfully',
      );
    });

    // it('should return a bad request response if userService.create throws an error', async () => {
    //   const createUserDto: CreateUserDto = {
    //     email: 'test@test.com',
    //     password: '12345',
    //   };
    //   const errorMessage = 'Request failed';

    //   mockUserService.create.mockRejectedValue(errorMessage);
    //   const statusSpy = jest.spyOn(mockResponse, 'status');
    //   const jsonSpy = jest.spyOn(mockResponse, 'json');

    //   await userController.create(mockResponse, createUserDto);

    //   expect(userService.create).toHaveBeenCalledWith(createUserDto);
    //   expect(statusSpy).toHaveBeenCalledWith(400);
    //   expect(jsonSpy).toHaveBeenCalledWith({
    //     type: 'error',
    //     status: 'FAIL',
    //     code: '02',
    //     message: 'Request failed',
    //   });
    // });
  });
});
