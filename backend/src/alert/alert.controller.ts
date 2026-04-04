import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alert')
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
  update(@Param('id') id: string) {
    return this.alertService.resolveAlert(id);
  }

}
