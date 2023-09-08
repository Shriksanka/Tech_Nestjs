import { User } from "src/users/users.model";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}