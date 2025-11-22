import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  controllers: [OperationsController],
  providers: [OperationsService, PrismaService],
  imports: [RealtimeModule],
})
export class OperationsModule {}
