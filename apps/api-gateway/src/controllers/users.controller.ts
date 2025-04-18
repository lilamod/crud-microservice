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
  async getAllUsers() {
    return this.sendMessage('get_all_users', {});
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
    return this.sendMessage('update_user', { id, userDto });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.sendMessage('delete_user', { id });
  }

  private async sendMessage(pattern: string, data: any, retries: number = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await lastValueFrom(this.client.send({ cmd: pattern }, data));
        return result;
      } catch (err) {
        if (attempt === retries - 1) {
          throw err; 
        }
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
