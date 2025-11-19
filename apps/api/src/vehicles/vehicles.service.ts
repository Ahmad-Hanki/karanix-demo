import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  async heartbeat(
    vehicleId: string,
    body: {
      lat: number;
      lng: number;
      heading?: number;
      speed?: number;
      timestamp?: string;
      operationId?: string;
    },
  ) {
    const timestamp = body.timestamp ? new Date(body.timestamp) : new Date();

    // 1) save heartbeat history
    const hb = await this.prisma.heartbeat.create({
      data: {
        vehicleId,
        operationId: body.operationId ?? null,
        lat: body.lat,
        lng: body.lng,
        heading: body.heading ?? null,
        speed: body.speed ?? null,
        timestamp,
      },
    });

    // 2) update vehicle last position
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        lastLat: body.lat,
        lastLng: body.lng,
        lastHeading: body.heading ?? null,
        lastSpeed: body.speed ?? null,
        lastPingAt: timestamp,
      },
    });

    if (body.operationId) {
      this.realtime.emitVehiclePosition(body.operationId, {
        vehicleId,
        lat: body.lat,
        lng: body.lng,
        heading: body.heading ?? null,
        speed: body.speed ?? null,
        timestamp,
      });
    }

    return hb;
  }
}
