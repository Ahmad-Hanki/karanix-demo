import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaxService } from './pax.service';
import { CreatePaxDto } from './dto/create-pax.dto';
import { UpdatePaxDto } from './dto/update-pax.dto';

@Controller('pax')
export class PaxController {
  constructor(private readonly paxService: PaxService) {}

  @Post(':id/checkin')
  checkin(@Param('id') id: string, @Body() body: any) {
    return this.paxService.checkin(id, body);
  }
}
