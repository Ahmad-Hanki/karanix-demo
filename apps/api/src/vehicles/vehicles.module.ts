import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, PrismaService],
  imports: [RealtimeModule],
})
export class VehiclesModule {}
