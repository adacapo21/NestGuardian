import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {
  private readonly logger = new Logger(JwtRefreshTokenGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
