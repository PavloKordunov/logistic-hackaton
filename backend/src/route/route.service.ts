import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DeliveryForOptimization,
  OptimizationService,
} from 'src/optimization/optimization.service';
import { AutoPlanDto } from './dto/auto-plan.dto';

@Injectable()
export class RouteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly optimizationService: OptimizationService,
  ) {}

  async autoPlan(dto: AutoPlanDto) {
    const { routeId, warehouse, deliveries } = await this.prisma.$transaction(
      async (tx) => {
        // 1. Fetch Brigades to understand their priorities
        const brigadeIds = [...new Set(dto.targets.map((t) => t.brigadeId))];
        const brigades = await tx.brigade.findMany({
          where: { id: { in: brigadeIds } },
        });
        const brigadeById = new Map(brigades.map((b) => [b.id, b]));

        for (const target of dto.targets) {
          if (!brigadeById.has(target.brigadeId)) {
            throw new NotFoundException(
              `Brigade not found: ${target.brigadeId}`,
            );
          }
        }

        // 2. Find the warehouse with the highest available resource quantity
        const resource = await tx.resource.findFirst({
          where: {
            name: dto.resourceName,
            quantity: { gt: 0 },
          },
          orderBy: { quantity: 'desc' },
          include: { Warehouse: true },
        });

        if (!resource) {
          throw new NotFoundException(
            `No warehouse has stock of resource "${dto.resourceName}"`,
          );
        }

        // 3. Sort targets by Brigade Priority: RED -> YELLOW -> GREEN
        const sortedTargets = [...dto.targets].sort((a, b) => {
          const priorities = { RED: 0, YELLOW: 1, GREEN: 2 };
          const pA = priorities[brigadeById.get(a.brigadeId)!.priority];
          const pB = priorities[brigadeById.get(b.brigadeId)!.priority];
          return pA - pB;
        });

        // 4. Allocate resources greedily based on required limit
        let availableQuantity = resource.quantity;
        let totalAllocated = 0;
        const allocatedTargets: { target: typeof dto.targets[0], allocatedAmount: number }[] = [];

        for (const target of sortedTargets) {
          if (availableQuantity <= 0) break;
          const assigned = Math.min(target.quantity, availableQuantity);
          availableQuantity -= assigned;
          totalAllocated += assigned;
          allocatedTargets.push({ target, allocatedAmount: assigned });
        }

        if (allocatedTargets.length === 0) {
          throw new ConflictException('Could not allocate any resources to targets');
        }

        const vehicle = await tx.vehicle.findFirst({
          where: { status: 'IDLE' },
        });

        if (!vehicle) {
          throw new ConflictException('No idle vehicle available');
        }

        const now = new Date();

        await tx.resource.update({
          where: { id: resource.id },
          data: {
            quantity: resource.quantity - totalAllocated,
            updatedAt: now,
          },
        });

        await tx.vehicle.update({
          where: { id: vehicle.id },
          data: { status: 'EN_ROUTE', updatedAt: now },
        });

        const newRouteId = randomUUID();
        await tx.route.create({
          data: {
            id: newRouteId,
            vehicleId: vehicle.id,
            warehouseId: resource.warehouseId,
            isActive: true,
            updatedAt: now,
          },
        });

        const created: DeliveryForOptimization[] = [];

        for (const { target, allocatedAmount } of allocatedTargets) {
          const brigade = brigadeById.get(target.brigadeId)!;
          const delivery = await tx.delivery.create({
            data: {
              id: randomUUID(),
              brigadeId: target.brigadeId,
              routeId: newRouteId,
              resourceId: resource.id,
              quantity: allocatedAmount,
              status: 'PENDING',
              priority: brigade.priority,
              updatedAt: now,
            },
            include: { Brigade: true },
          });
          created.push(delivery);
        }

        return {
          routeId: newRouteId,
          warehouse: resource.Warehouse,
          deliveries: created,
        };
      },
    );

    await this.optimizationService.calculateAndApplyOrder(
      routeId,
      warehouse.lat,
      warehouse.lng,
      deliveries,
    );

    return this.prisma.route.findFirst({
      where: { id: routeId },
      include: {
        Vehicle: true,
        Warehouse: true,
        Delivery: {
          orderBy: { stepOrder: 'asc' },
          include: { Brigade: true, Resource: true },
        },
      },
    });
  }

  getDriverRoute(vehicleId: string) {
    return this.prisma.route.findFirst({
      where: { vehicleId, isActive: true },
      include: {
        Vehicle: true,
        Warehouse: true,
        Delivery: {
          orderBy: { stepOrder: 'asc' },
          include: { Brigade: true, Resource: true },
        },
      },
    });
  }
}
