import { diskStorage } from 'multer';

export const multerConfig = {
    dest: './uploads',
    limits: {
        FileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Недоступный формат файла'), false);
        }
        cb(null, true);
    },
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads');
        },
        filename: (req, file, cb) => {
            const randomName = Date.now() + '-' + file.originalname;
            cb(null, randomName);
        },
    }),
};