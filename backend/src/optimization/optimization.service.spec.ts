import { Test, TestingModule } from '@nestjs/testing';
import { OptimizationService } from './optimization.service';

describe('OptimizationService', () => {
  let service: OptimizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptimizationService],
    }).compile();

    service = module.get<OptimizationService>(OptimizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
