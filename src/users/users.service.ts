import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: CreateUserDto) {
        try {
        const user = await this.userRepository.create(dto);
        return user;
        } catch (e) {
            throw new Error('Не удалось создать пользователя')
        }
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async validateRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        const user = await this.userRepository.findOne({where: {id: userId, refreshToken}});

        if (user && user.refreshToken === refreshToken) {
            return true;
        }
        return false;
    }
}
