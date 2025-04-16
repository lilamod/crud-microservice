import { Controller, Get } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, SigninUsertDto } from '@app/libs';
import * as bcrypt from 'bcrypt';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern({ cmd: 'signin' })
  async signin(SigninUserDto: SigninUsertDto) {
    try {
      const userData = await this.authService.userSignIn(SigninUserDto.email);

      if (!userData) {
        return {
          success: false,
          message: 'User  does not exist',
        };
      }

      const isPasswordMatching = await bcrypt.compare(
        SigninUserDto.password,
        userData.password,
      );

      if (!isPasswordMatching) {
        return {
          success: false,
          message: 'Your password does not match the stored password',
        };
      }

      const now = new Date();
      const sessionSalt = bcrypt.genSaltSync(10);
      let sessionToken = userData.name + userData.id;
      sessionToken = bcrypt.hashSync(sessionToken, sessionSalt);

      const sessionUserData = {
        user_id: userData.id,
        token: sessionToken,
        expire_at: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds(),
        ),
      };

      const sessionResponse = await this.authService.saveSessionToken(
        sessionUserData,
      );

      const userDetail = {
        user_Id: userData.id,
        token: sessionResponse,
        phone: userData.phone,
      };

      return {
        success: true,
        message: 'User successfully signed in',
        item: userDetail,
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during sign-in',
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'signup' })
  async signup(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.authService.isUserExist(
        'email',
        createUserDto.email,
      );
      if (emailExists) {
        return {
          success: false,
          message: 'Your email id is already exist',
        };
      }
      const userExists = await this.authService.isUserExist(
        'phone',
        createUserDto.phone,
      );
      if (userExists) {
        return {
          success: false,
          message: 'Your phone number is already exist',
        };
      }
      var salt = bcrypt.genSaltSync(10);
      var passwordInPlaintext = createUserDto.password;
      const hashedPassword = bcrypt.hashSync(passwordInPlaintext, salt);
      createUserDto.password = hashedPassword;
      createUserDto.salt = salt;

      const client = await this.authService.signup(createUserDto);
      return {
        success: false,
        message: 'You have been succesfully signup ',
        item: client,
      };
    } catch (errorMsg) {
      return { message: errorMsg.message };
    }
  }
}
