import { CreateUserDto, SigninUsertDto } from '@app/libs';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Post('/signin')
  async signIn(@Body() signinUsertDto: SigninUsertDto) {
    return await this.sendMessage('signin', signinUsertDto);
  }

  @Post('/signup')
  async signUp(@Body() signinUserDto: CreateUserDto) {
    return await this.sendMessage('signup', signinUserDto);
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
