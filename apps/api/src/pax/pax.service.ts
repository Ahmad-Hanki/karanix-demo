import { Injectable } from '@nestjs/common';
import { CreatePaxDto } from './dto/create-pax.dto';
import { UpdatePaxDto } from './dto/update-pax.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckinMethod, PaxStatus } from '@prisma/client';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Injectable()
export class PaxService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}
  async checkin(
    paxId: string,
    body: {
      eventId: string;
      method: 'qr' | 'manual';
      gps?: { lat: number; lng: number };
      photoUrl?: string;
    },
  ) {
    const pax = await this.prisma.pax.findUnique({ where: { id: paxId } });
    if (!pax) throw new Error('Pax not found');

    const operationId = pax.operationId;

    // idempotency: if eventId already exists, just return
    const existing = await this.prisma.checkinEvent.findUnique({
      where: { eventId: body.eventId },
    });
    if (existing) return existing;

    const event = await this.prisma.checkinEvent.create({
      data: {
        eventId: body.eventId,
        paxId,
        operationId,
        method: body.method === 'qr' ? CheckinMethod.QR : CheckinMethod.MANUAL,
        gpsLat: body.gps?.lat ?? null,
        gpsLng: body.gps?.lng ?? null,
        photoUrl: body.photoUrl ?? null,
      },
    });

    await this.prisma.$transaction([
      this.prisma.pax.update({
        where: { id: paxId },
        data: { status: PaxStatus.CHECKED_IN },
      }),
      this.prisma.operation.update({
        where: { id: operationId },
        data: {
          checkedInCount: { increment: 1 },
        },
      }),
    ]);

    // emit manifest update
    this.realtime.emitPaxUpdated(operationId, {
      paxId,
      status: PaxStatus.CHECKED_IN,
    });

    return event;
  }
}
