/* eslint-disable prettier/prettier */
import { Controller, Body, Post, Get, Headers, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { parse } from 'date-fns';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {

    constructor(private userService: UserService, private authService: AuthService) { }

    @Post()
    async verifyEmail(@Body("email") email) {

        try {
            await this.userService.getByEmail(email);
            return { exists: true };
        } catch (error) {
            return { exists: false };
        }
    }

    @Post("register")
    async register(
        @Body("name") name,
        @Body("email") email,
        @Body("birthAt") birthAt,
        @Body("phone") phone,
        @Body("document") document,
        @Body("password") password
    ) {

        if (birthAt) {

            try {
                birthAt = parse(birthAt, "yyyy-MM-dd", new Date());
            } catch (error) {
                throw new BadRequestException("A data é inválida");
            }

        }
        const user = await this.userService.create({
            name, email, birthAt, phone, document, password
        });

        const token = await this.authService.getToken(user.id);

        return { user, token };
    }

    @Post("login")
    async login(@Body("email") email, @Body("password") password) {

        return this.authService.login({ email, password });
    }

    // @Get("me")
    // async me(@Headers("authorization") authorization) {

    //     const token = authorization.split(" ")[1];
    //     return await this.authService.decodeToken(token);
    // }
}
