import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { Logger } from '@nestjs/common';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
    this.logger.warn('JwtRefreshTokenStrategy initialized');
  }

  async validate(payload: JwtPayload): Promise<any> {
    this.logger.warn(`Payload: ${JSON.stringify(payload)}`);
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }
    return user;
  }
}
