/* eslint-disable prettier/prettier */
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UserModule,
        JwtModule.registerAsync({
            useFactory: () => ({

                console.log(process.env.JWT_EXPIRE);

                return {
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                }
                
            })
        })
    ],
    controllers: [
        AuthController,],
    providers: [
        AuthService,],
})
export class AuthModule { }
