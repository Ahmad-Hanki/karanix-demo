import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OperationStatus, Prisma } from '@prisma/client';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Injectable()
export class OperationsService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  create(createOperationDto: CreateOperationDto) {
    return 'This action adds a new operation';
  }

  async listAllOperations(
    date?: string,
    status?: OperationStatus,
    vehicle?: boolean,
    driver?: boolean,
    guide?: boolean,
  ) {
    const day = date ? new Date(date) : new Date();

    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const include: Prisma.OperationInclude = {};

    if (vehicle) include.vehicle = true;
    if (driver) include.driver = true;
    if (guide) include.guide = true;

    const op = await this.prisma.operation.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(status ? { status } : {}),
      },
      ...(Object.keys(include).length ? { include } : {}),
    });

    console.log('Fetched operations:', op);

    return op;
  }

  async findOne(id: string) {
    console.log('Finding operation with id:', id);
    const op = await this.prisma.operation.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: { select: { id: true, name: true } },
        guide: { select: { id: true, name: true } },
        pax: true,
      },
    });

    if (!op) {
      throw new HttpException(
        {
          message: 'Operation not found',
          error: 'Not Found',
        },
        404,
      );
    }

    return op;
  }

  async startOperation(id: string) {
    const op = await this.prisma.operation.findUnique({ where: { id } });
    if (!op) throw new NotFoundException('Operation not found');

    if (op.status === OperationStatus.ACTIVE) {
      throw new BadRequestException('Operation is already active');
    }
    if (
      op.status === OperationStatus.COMPLETED ||
      op.status === OperationStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot start a completed/cancelled operation',
      );
    }

    const updated = await this.prisma.operation.update({
      where: { id },
      data: { status: OperationStatus.ACTIVE },
    });

    // Optional WS event: status change / alert
    this.realtime.emitAlert(id, {
      type: 'STATUS_CHANGE',
      status: updated.status,
    });

    return updated;
  }

  async checkLowCheckinForOperation(id: string) {
    const op = await this.prisma.operation.findUnique({
      where: { id },
    });

    if (!op) throw new NotFoundException('Operation not found');

    // rule only applies to ACTIVE operations
    if (op.status !== OperationStatus.ACTIVE) {
      return {
        alerted: false,
        reason: 'Operation is not ACTIVE',
      };
    }

    const now = new Date();
    const startPlus15 = new Date(op.startTime);
    startPlus15.setMinutes(startPlus15.getMinutes() + 15);

    if (now < startPlus15) {
      return {
        alerted: false,
        reason: 'Too early, startTime + 15min not reached yet',
      };
    }

    if (op.totalPax === 0) {
      return {
        alerted: false,
        reason: 'No pax on this operation',
      };
    }

    const ratio = op.checkedInCount / op.totalPax;

    if (ratio >= 0.7) {
      return {
        alerted: false,
        reason: 'Check-in ratio >= 0.7',
        ratio,
      };
    }

    // --------------- ALERT! ---------------
    const payload = {
      type: 'LOW_CHECKIN',
      message: 'Low check-in rate (< 70% after 15 minutes).',
      ratio,
      checkedInCount: op.checkedInCount,
      totalPax: op.totalPax,
      operationId: op.id,
    };

    this.realtime.emitAlert(id, payload);

    return {
      alerted: true,
      ...payload,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} operation`;
  }
}
