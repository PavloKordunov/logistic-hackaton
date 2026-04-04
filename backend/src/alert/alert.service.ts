import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private readonly prisma:PrismaService){}
 async createPanicEvent(dto: CreateAlertDto) {
    const alert=await this.prisma.alert.create({
      data:{
        brigadeId:dto.brigadeId,
        message:dto.message
      }
    })
    await this.prisma.brigade.update({
      where:{id:dto.brigadeId},
      data:{priority:'RED'}
    })
    return alert;
  }

  async findAllActive() {
    return this.prisma.alert.findMany({
      where:{isResolved:true},
      include:{brigade:true},
      orderBy:{createdAt:'desc'}
    });
  }
async resolveAlert(id:string){
  return this.prisma.alert.update({
    where:{id},
    data:{isResolved:true}
  })
}
}
