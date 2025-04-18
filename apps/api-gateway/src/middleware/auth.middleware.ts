import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction, response } from 'express';
import { ApiGatewayService } from '../api-gateway.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly clientService: ApiGatewayService) {}

  async use(req, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'test') {
      return next();
  }
    const authHeaders = req.headers['x-access-token'];
    if (authHeaders && authHeaders != '') {
      const token = authHeaders;
      const user = await this.clientService.getSessionDetail(token);
      if (user) {
        var now = new Date();
        if (user.expire_at.getTime() > now.getTime()) {
          const updateSession = {
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
          await this.clientService.updateSessionToken(
            user.session_id,
            updateSession,
          );

          req.user = user;
          next();
        } else {
          return res.status(400).json({
            success: false,
            message: 'Token is expired',
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Token is Invalid',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Token is not available',
      });
    }
  }
}
