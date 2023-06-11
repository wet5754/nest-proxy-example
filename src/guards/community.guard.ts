import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CommunityAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.user = 'user';
    return true;
  }
}
