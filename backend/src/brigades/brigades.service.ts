import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateBrigadeDto } from './dto/create-brigade.dto';
import { UpdateBrigadeDto } from './dto/update-brigade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrigadesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createBrigadeDto: CreateBrigadeDto) {
    return this.prisma.brigade.create({
      data: {
        id: randomUUID(),
        ...createBrigadeDto,
        lat: createBrigadeDto.lat,
        lng: createBrigadeDto.lng,
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
      where: { id },
      include: { Delivery: true, Alert: true },
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
