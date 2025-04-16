import { Controller, Get } from '@nestjs/common';
import { UserService } from './user-service.service';
import { CreateUserDto, Users, UpdateUserDto } from '@app/libs';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() userDto: CreateUserDto) {
    const duplicateEmail = await this.userService.userExist(
      'email',
      userDto.email,
    );
    if (duplicateEmail) {
      return {
        success: false,
        message: 'Email address you have provided already exists.',
      };
    }

    const duplicatePhone = await this.userService.userExist(
      'phone',
      userDto.phone,
    );
    if (duplicatePhone) {
      return {
        success: false,
        message: 'Phone number is already in use.',
      };
    }

    try {
      const createdUser = await this.userService.create(userDto);
      return {
        success: true,
        message: 'User successfully created.',
        user: createdUser,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating user: ${error.message}`,
      };
    }
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers(
    body: any,
  ): Promise<{ success: boolean; count: number; list: Users[] }> {
    const userDetails = await this.userService.findAll(body);
    if (userDetails.list.length > 0) {
      return {
        success: true,
        count: userDetails.count,
        list: userDetails.list,
      };
    } else {
      return { success: false, count: 0, list: [] };
    }
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(data: { id: number }) {
    const userDetail = await this.userService.findOne(data.id);
    if (userDetail) {
      return {
        success: true,
        item: userDetail,
      };
    } else {
      return {
        success: false,
        message: 'User detail does not exist',
      };
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(data: { id: number; userDto: UpdateUserDto }) {
    const userExist = await this.userService.findOne(data.id);
    if (userExist) {
      await this.userService.update(data.id, data.userDto);
      return {
        success: true,
        message: 'User detail has been updated successfully',
      };
    } else {
      return {
        success: false,
        message: 'User detail Does not exist',
      };
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(data: { id: number }) {
    const userExist = await this.userService.findOne(data.id);
    if (userExist) {
      await this.userService.remove(data.id);
      return {
        success: true,
        message: 'User detail has been deleted successfully',
      };
    } else {
      return {
        success: false,
        message: 'User detail Does not exist',
      };
    }
  }
}
