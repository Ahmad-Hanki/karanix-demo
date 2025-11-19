import { Module } from '@nestjs/common';
import { PaxService } from './pax.service';
import { PaxController } from './pax.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  controllers: [PaxController],
  providers: [PaxService, PrismaService],
  imports: [RealtimeModule],
})
export class PaxModule {}
