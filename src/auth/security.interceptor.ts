import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const refreshToken = this.getRefreshFromRequest(request);

    console.log('SecurityInterceptor is running');
    console.log('Refresh token:', refreshToken);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    if (request.secure) {
      response.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure`);
      console.log('Setting Secure Cookie');
    } else {
      response.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly`);
      console.log('Setting Non-Secure Cookie');
    }

    return next.handle();
  }

  private getRefreshFromRequest(request: Request): string | undefined {
    const user = (request as any).res?.locals?.user;

    if (user && user.refreshToken) {
      return user.refreshToken;
    }

    return undefined;
  }
}
