import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-deliveryStatus.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  createDelivery(@Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.createDelivery(dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveriesService.updateStatus(id, updateDeliveryDto.status);
  }

}
