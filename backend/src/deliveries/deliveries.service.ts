import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}
  async createDelivery(dto: CreateDeliveryDto) {
    const now = new Date();
    return this.prisma.delivery.create({
      data: {
        id: randomUUID(),
        brigadeId: dto.brigadeId,
        resourceId: dto.resourceId,
        quantity: dto.quantity,
        updatedAt: now,
      },
      include: {
        Brigade: true,
        Resource: true,
      },
    });
  }

  async findAllDeliveries() {
    return this.prisma.delivery.findMany({
      include: {
        Brigade: true,
        Resource: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { Brigade: true },
    });

    if (status === 'DELIVERED' && delivery.Brigade.priority === 'RED') {
      await this.prisma.brigade.update({
        where: { id: delivery.brigadeId },
        data: { priority: 'GREEN' },
      });
    }
    return delivery;
  }

  async findAll() {
    return this.prisma.delivery.findMany({
      include: {
        Brigade: true,
        Resource: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.delivery.findUnique({
      where: { id },
      include: {
        Brigade: true,
        Resource: true,
      },
    });
  }
}
