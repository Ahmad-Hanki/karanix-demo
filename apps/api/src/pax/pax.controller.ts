import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaxService } from './pax.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pax')
export class PaxController {
  constructor(private readonly paxService: PaxService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/checkin')
  checkin(
    @Param('id') id: string,
    @Body()
    body: {
      eventId: string;
      method: 'qr' | 'manual';
      gps?: { lat: number; lng: number };
      photoUrl?: string;
    },
  ) {
    return this.paxService.checkin(id, body);
  }
}
