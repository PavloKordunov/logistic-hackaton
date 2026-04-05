import { Injectable } from '@nestjs/common';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma:PrismaService){}

  findAllVehicles() {
    return this.prisma.vehicle.findMany({
      select:{id:true,driverName:true,lat:true,lng:true,status:true}
    });
  }

  async updateLocation(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id }, select: { status: true } });
    
    return this.prisma.vehicle.update({
      where:{id},
      data:{
        ...dto, 
        ...(vehicle?.status === 'OFFLINE' && { status: 'EN_ROUTE' }),
        updatedAt: new Date()
      }
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleOfflineVehicles() {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    await this.prisma.vehicle.updateMany({
      where: {
        status: 'EN_ROUTE',
        updatedAt: { lt: fiveMinutesAgo },
      },
      data: { status: 'OFFLINE' },
    });
  }
}
