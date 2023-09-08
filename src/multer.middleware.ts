import { Injectable, NestMiddleware } from "@nestjs/common";
import { multerConfig } from "./multer.config";
import * as multer from 'multer'


@Injectable()
export class MulterMiddleware implements NestMiddleware {
    private upload = multer(multerConfig).single('avatar')

    use(req: any, res: any, next: (error?: any) => void) {
        if (!req.file) {
            return next();
        }
        
        this.upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({message: 'Ошибка загрузки файла'});
            }
            next();
        });
    }
}