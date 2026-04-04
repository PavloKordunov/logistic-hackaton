import { Injectable } from '@nestjs/common';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma:PrismaService){}

  findAllVehicles() {
    return this.prisma.vehicle.findMany({
      select:{id:true,driverName:true,lat:true,lng:true,status:true}
    });
  }

  updateLocation(id: string, dto: UpdateVehicleDto) {
    return this.prisma.vehicle.update({
      where:{id},
      data:{...dto}
    });
  }

}
