import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Delivery, Priority } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

export type DeliveryForOptimization = Delivery & {
  Brigade: { lat: number; lng: number };
};

interface OptimizePayload {
  start_point: { lat: number; lng: number };
  points: { id: string; lat: number; lng: number; priority: Priority }[];
}

interface OptimizeResponseBody {
  optimizedOrder: string[];
}

@Injectable()
export class OptimizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async calculateAndApplyOrder(
    routeId: string,
    startLat: number,
    startLng: number,
    deliveries: DeliveryForOptimization[],
  ): Promise<void> {
    const pending = deliveries.filter((d) => d.status === 'PENDING');

    if (pending.length === 0) {
      this.eventEmitter.emit('route.updated', { routeId });
      return;
    }

    const payload: OptimizePayload = {
      start_point: { lat: startLat, lng: startLng },
      points: pending.map((d) => ({
        id: d.id,
        lat: d.Brigade.lat,
        lng: d.Brigade.lng,
        priority: d.priority,
      })),
    };

    const url =
      this.configService.get<string>('PYTHON_MICROSERVICE_URL') ??
      'http://localhost:8000/optimize';

    let optimizedOrder: string[];
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<OptimizeResponseBody>(url, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60_000,
        }),
      );
      if (!data?.optimizedOrder || !Array.isArray(data.optimizedOrder)) {
        throw new Error('Invalid response: missing optimizedOrder');
      }
      optimizedOrder = data.optimizedOrder;
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : String(err);
      throw new ServiceUnavailableException(
        `Optimization service unavailable: ${msg}`,
      );
    }

    const idSet = new Set(pending.map((d) => d.id));
    if (optimizedOrder.length !== pending.length) {
      throw new ServiceUnavailableException(
        'Optimization result size does not match pending deliveries',
      );
    }
    for (const id of optimizedOrder) {
      if (!idSet.has(id)) {
        throw new ServiceUnavailableException(
          'Optimization returned an unknown delivery id',
        );
      }
    }

    const now = new Date();
    await this.prisma.$transaction(
      optimizedOrder.map((deliveryId, index) =>
        this.prisma.delivery.update({
          where: { id: deliveryId },
          data: { stepOrder: index + 1, updatedAt: now },
        }),
      ),
    );

    this.eventEmitter.emit('route.updated', { routeId });
  }
}
