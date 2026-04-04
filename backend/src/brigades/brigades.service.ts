import { Injectable } from '@nestjs/common';
import { CreateBrigadeDto } from './dto/create-brigade.dto';
import { UpdateBrigadeDto } from './dto/update-brigade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrigadesService {
  constructor(private readonly prisma:PrismaService){}
  create(createBrigadeDto: CreateBrigadeDto) {
    return this.prisma.brigade.create({
      data:{
      ...createBrigadeDto
      },
    });
  }

  findAll() {
    return this.prisma.brigade.findMany({
      orderBy:{
        priority:'desc'
      }
    });
  }

  findOne(id: string) {
    return this.prisma.brigade.findUnique({
      where:{id},
      include:{deliveries:true,alerts:true}
    });
  }

  update(id: string, updateBrigadeDto: UpdateBrigadeDto) {
    return this.prisma.brigade.update({
         where:{id},
         data:{...updateBrigadeDto}
    })
  };


  remove(id: string) {
    return this.prisma.brigade.delete({
      where:{id}
    });
  }
}
