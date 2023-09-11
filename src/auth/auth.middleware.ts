import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users/users.service";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService,
                private userService: UsersService) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        
        if (authHeader) {
            const [bearer, token] = authHeader.split(' ');

            if (bearer === 'Bearer' && token) {
                try {
                    const user = this.jwtService.verify(token);
                    req.user = user;

                    user.refreshToken = await this.userService.getRefreshTokenByEmail(user.email);

                    res.locals.user = user;
                    return next();
                } catch (e) {
                    throw new UnauthorizedException({message: 'Пользователь не авторизован'})
                }
            }
        }
        throw new UnauthorizedException({message: 'Пользователь не авторизован'})
    }
    
}