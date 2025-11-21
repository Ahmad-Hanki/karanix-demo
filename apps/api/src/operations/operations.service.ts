import { HttpException, Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OperationStatus, Prisma } from '@prisma/client';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

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

  update(id: number, updateOperationDto: UpdateOperationDto) {
    return `This action updates a #${id} operation`;
  }

  remove(id: number) {
    return `This action removes a #${id} operation`;
  }
}
