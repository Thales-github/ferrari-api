/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) { }

    async getToken(userId: number) {

        const { email, photo, id, person } = await this.userService.get(userId);
        const { name } = person;

        return this.jwtService.sign({
            name, email, photo, id
        });
    }

    async login({ email, password }: { email: string; password: string }) {


        const user = await this.userService.getByEmail(email);
        // console.log({user, password});

        await this.userService.checkPassword(user.id, password);

        const token = await this.getToken(user.id);
        return {
            token
        };
    }
}
