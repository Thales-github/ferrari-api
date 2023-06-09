import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
