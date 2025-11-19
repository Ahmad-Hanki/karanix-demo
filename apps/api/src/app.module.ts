import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { OperationsModule } from './operations/operations.module';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), PrismaModule, OperationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
