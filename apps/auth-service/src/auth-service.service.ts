import { Session, Users } from '@app/libs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async isUserExist(field: any, value: any): Promise<Users | null> {
    return await this.userRepository.findOne({
      where: { [field]: value, is_deleted: false },
    });
  }

  async signup(user: any): Promise<Users> {
    const userData = await this.userRepository.save(user);
    return userData.id;
  }

  async userSignIn(param: any): Promise<Users | null> {
    return await this.userRepository.findOne({
      where: [{ email: param }, { is_deleted: false }],
    });
  }
  async saveSessionToken(sessionData: any): Promise<Session> {
    const sessionObj = await this.sessionRepository.save(sessionData);
    return sessionObj.token;
  }
}
