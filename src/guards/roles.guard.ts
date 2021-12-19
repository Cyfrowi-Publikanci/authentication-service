import { Injectable, CanActivate, Inject, ExecutionContext, Logger } from '@nestjs/common';
import { SessionService } from 'src/session/session.service';


@Injectable()
export class AdminsGuard implements CanActivate {
  constructor(@Inject(SessionService) private readonly authorizationService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const args = context.getArgs();

    const { attributes } = args[0];
    const { path } = attributes.request.http;

    if (path != '/authentication.UsersService/getAllUsers') return true;

    try {
      const [, token] = attributes.request.http.headers.authorization.split('Bearer ');
      await this.authorizationService.authorizeAdmin(token);

      return true;
    } catch (error) {
      Logger.error(`AdminsGuard, ${error.stack}`);

      return false;
    }
  }
}
