import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptimizationService } from 'src/optimization/optimization.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly optimizationService: OptimizationService,
  ) {}

  async createPanicEvent(dto: CreateAlertDto) {
    const brigade = await this.prisma.brigade.findUnique({
      where: { id: dto.brigadeId },
    });
    if (!brigade) {
      throw new NotFoundException(`Brigade not found: ${dto.brigadeId}`);
    }

    const now = new Date();

    const alert = await this.prisma.alert.create({
      data: {
        id: randomUUID(),
        brigadeId: dto.brigadeId,
        message: dto.message,
      },
    });

    await this.prisma.brigade.update({
      where: { id: dto.brigadeId },
      data: { priority: 'RED' },
    });

    await this.prisma.delivery.updateMany({
      where: { brigadeId: dto.brigadeId, status: 'PENDING' },
      data: { priority: 'RED', updatedAt: now },
    });

    const route = await this.prisma.route.findFirst({
      where: {
        isActive: true,
        Delivery: {
          some: { brigadeId: dto.brigadeId, status: 'PENDING' },
        },
      },
      include: {
        Vehicle: true,
        Delivery: {
          where: { status: 'PENDING' },
          include: { Brigade: true },
        },
      },
    });

    if (route) {
      await this.optimizationService.calculateAndApplyOrder(
        route.id,
        route.Vehicle.lat,
        route.Vehicle.lng,
        route.Delivery,
      );
    }

    return alert;
  }

  findAllActive() {
    return this.prisma.alert.findMany({
      where: { isResolved: false },
      include: { Brigade: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  resolveAlert(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { isResolved: true },
    });
  }
}
