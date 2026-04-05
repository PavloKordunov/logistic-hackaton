import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtGuard';

@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('panic')
  createPanic(@Body() dto: CreateAlertDto) {
    return this.alertService.createPanicEvent(dto);
  }

  @Get()
  findAllActive() {
    return this.alertService.findAllActive();
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.alertService.resolveAlert(id);
  }
}
