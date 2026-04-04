import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-deliveryStatus.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma:PrismaService){}
  async createDelivery(dto: CreateDeliveryDto) {
    return this.prisma.delivery.create({
      data:{
        brigadeId:dto.brigadeId,
        resourceId:dto.resourceId,
        quantity:dto.quantity
      },
      include:{
        brigade:true,
        resource:true
      }
    });
  }

  async findAllDeliveries() {
    return this.prisma.delivery.findMany({
      include:{
        brigade:true,
        resource:true
      },
      orderBy:{createdAt:'desc'}
    });
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    const delivery=await this.prisma.delivery.update({
      where:{id},
      data:{status},
      include:{brigade:true}
    });

    if(status==='DELIVERED' && delivery.brigade.priority==='RED'){
       await this.prisma.delivery.update({
        where:{id:delivery.brigadeId},
        data:{priority:'GREEN'}
       })
    }
    return delivery
  }
}
