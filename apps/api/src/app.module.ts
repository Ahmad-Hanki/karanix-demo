import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { OperationsModule } from './operations/operations.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PaxModule } from './pax/pax.module';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), PrismaModule, OperationsModule, VehiclesModule, PaxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
