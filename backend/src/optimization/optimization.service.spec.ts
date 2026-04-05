import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptimizationService } from './optimization.service';

describe('OptimizationService', () => {
  let service: OptimizationService;
  let httpService: { post: jest.Mock };
  let prisma: { $transaction: jest.Mock };
  let eventEmitter: { emit: jest.Mock };

  beforeEach(async () => {
    httpService = { post: jest.fn() };
    prisma = {
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
      delivery: {
        update: jest.fn().mockResolvedValue({}),
      },
    };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptimizationService,
        { provide: HttpService, useValue: httpService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('http://localhost:8000') },
        },
        { provide: PrismaService, useValue: prisma },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<OptimizationService>(OptimizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('emits route.updated when no pending deliveries', async () => {
    await service.calculateAndApplyOrder('route-1', 0, 0, []);
    expect(eventEmitter.emit).toHaveBeenCalledWith('route.updated', {
      routeId: 'route-1',
    });
    expect(httpService.post).not.toHaveBeenCalled();
  });

  it('posts to optimize and updates step orders', async () => {
    const deliveries = [
      {
        id: 'd1',
        status: 'PENDING' as const,
        priority: 'GREEN' as const,
        Brigade: { lat: 1, lng: 2 },
      },
    ];
    httpService.post.mockReturnValue(
      of({ data: { optimizedOrder: ['d1'] } }),
    );

    await service.calculateAndApplyOrder('route-1', 48, 35, deliveries as never);

    expect(httpService.post).toHaveBeenCalled();
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith('route.updated', {
      routeId: 'route-1',
    });
  });

  it('throws when optimize HTTP fails', async () => {
    const deliveries = [
      {
        id: 'd1',
        status: 'PENDING' as const,
        priority: 'GREEN' as const,
        Brigade: { lat: 1, lng: 2 },
      },
    ];
    httpService.post.mockReturnValue(throwError(() => new Error('network')));

    await expect(
      service.calculateAndApplyOrder('route-1', 48, 35, deliveries as never),
    ).rejects.toThrow();
  });
});
