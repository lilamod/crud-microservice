import { CreateUserDto, UpdateUserDto } from '@app/libs';
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
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@ApiTags('Users')
@ApiSecurity('x-access-token')
@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  @ApiResponse({ status: 200, type: CreateUserDto })
  async createUser(@Body() userDto: CreateUserDto) {
    userDto.salt = bcrypt.genSaltSync(10);
    userDto.password = bcrypt.hashSync(userDto.password, userDto.salt);
    return this.sendMessage('create_user', userDto);
  }

  @Get()
  async getAllUsers(@Body() body: any) {
    return this.sendMessage('get_all_users', body);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async getUser(@Param('id') id: string) {
    return this.sendMessage('get_user', { id });
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    userDto.salt = bcrypt.genSaltSync(10);
    if (userDto.password) {
      userDto.password = bcrypt.hashSync(userDto.password, userDto.salt);
    }
    return this.sendMessage('update_user', { id, ...userDto });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.sendMessage('delete_user', { id });
  }

  private async sendMessage(pattern: string, data: any) {
    try {
      const result = await lastValueFrom(
        this.client.send({ cmd: pattern }, data),
      );
      console.log('Microservice responded:', result);
      return result;
    } catch (err) {
      console.error(' Microservice call failed:', err);
      return err;
    }
  }
}
