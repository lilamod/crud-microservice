import { Session } from '@app/libs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApiGatewayService {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getSessionDetail(token: any): Promise<any> {
    return await this.sessionRepository
      .createQueryBuilder('session')
      .select([
        'session.id AS session_id',
        'session.is_deleted AS session_is_deleted',
        'session.*',
        'ud.*',
        'ud.id AS user_id',
      ])
      .leftJoin('users', 'ud', 'session.user_id = ud.id')
      .where('session.token = :token', { token })
      .andWhere('session.is_deleted = :is_deleted', { is_deleted: false })
      .getRawOne();
  }
  async updateSessionToken(id: any, updateArray: any) {
    const updateSession = await this.sessionRepository.update(id, updateArray);
    return updateSession;
  }
}
