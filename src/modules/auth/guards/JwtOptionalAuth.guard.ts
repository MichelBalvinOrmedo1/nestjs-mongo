// src/auth/guards/jwt-optional-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    // Retorna el usuario si está autenticado, de lo contrario retorna null
    return user || null;
  }
}
