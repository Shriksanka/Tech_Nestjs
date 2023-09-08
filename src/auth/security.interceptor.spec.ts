import { Test, TestingModule } from '@nestjs/testing';
import { SecurityInterceptor } from './security.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { of } from 'rxjs';

describe('SecurityInterceptor', () => {
  let interceptor: SecurityInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityInterceptor],
    }).compile();

    interceptor = module.get<SecurityInterceptor>(SecurityInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should set CORS headers and cookies correctly', () => {
    const request = {} as Request;
    request.secure = true;
    const setHeaderMock = jest.fn();
    const response = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as ExecutionContext;

    const callHandler: CallHandler<any> = {
      handle: () => of({}),
    };

    interceptor.intercept(context, callHandler);

    expect(response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    expect(response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    expect(response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
    expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('HttpOnly; Secure'));
  });
});
