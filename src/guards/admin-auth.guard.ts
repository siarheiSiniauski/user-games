import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as basicAuth from 'basic-auth';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly adminUsername = 'admin'; // Ваше имя пользователя
  private readonly adminPassword = 'A8b#1xP@2y&Z'; // Ваш пароль

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const credentials = basicAuth(request);

    if (
      credentials &&
      credentials.name === this.adminUsername &&
      credentials.pass === this.adminPassword
    ) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
