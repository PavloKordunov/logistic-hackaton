import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createResourceDto: any) {
    return this.prisma.resource.create({
      data: {
        id: randomUUID(),
        name: createResourceDto.name,
        quantity: createResourceDto.quantity,
        warehouseId: createResourceDto.warehouseId,
        updatedAt: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.resource.findMany({
      include: { Warehouse: true },
    });
  }

  findOne(id: string) {
    return this.prisma.resource.findUnique({
      where: { id },
      include: { Warehouse: true },
    });
  }

  update(id: string, updateResourceDto: any) {
    return this.prisma.resource.update({
      where: { id },
      data: { ...updateResourceDto, updatedAt: new Date() },
    });
  }

  remove(id: string) {
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
