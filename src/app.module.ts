import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
