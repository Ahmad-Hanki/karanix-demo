import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}
  @Post(':id/heartbeat')
  heartbeat(
    @Param('id') id: string,
    @Body()
    body: {
      lat: number;
      lng: number;
      heading?: number;
      speed?: number;
      timestamp?: string;
      operationId?: string;
    },
  ) {
    return this.vehiclesService.heartbeat(id, body);
  }
}
