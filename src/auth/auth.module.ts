/* eslint-disable prettier/prettier */
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [UserModule],
    controllers: [
        AuthController,],
    providers: [
        AuthService,],
})
export class AuthModule { }
