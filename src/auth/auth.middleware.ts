import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}
    
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        
        if (authHeader) {
            const [bearer, token] = authHeader.split(' ');

            if (bearer === 'Bearer' && token) {
                try {
                    const user = this.jwtService.verify(token);
                    req.user = user;
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