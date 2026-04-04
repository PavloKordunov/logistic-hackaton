import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AssignRouteDto } from './dto/assign-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma:PrismaService){}

  async createRoute(dto:AssignRouteDto ) {
    const route=await this.prisma.route.create({
      data:{
        vehicleId:dto.vehicleId,
        isActive:true
      }
    })
    await this.prisma.delivery.updateMany({
      where:{id:{in:dto.deliveryIds}},
      data:{
        routeId:route.id,
        status:'IN_PROGRESS'
      }
    })
    await this.prisma.vehicle.update({
      where:{id:dto.vehicleId},
      data:{
        status:'EN_ROUTE'
      }
    })

    return this.getDriverRoute(dto.vehicleId)
  }
async getDriverRoute(vehicleId:string){
  return this.prisma.route.findFirst({
    where:{vehicleId:vehicleId,isActive:true},
    include:{
      deliveries:{
        orderBy:{stepOrder:'asc'},
        include:{
          brigade:true,
          resource:true
        }
      }
    }
  })
}
}
