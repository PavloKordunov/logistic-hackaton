import { Test, TestingModule } from '@nestjs/testing';
import { BrigadesService } from './brigades.service';

describe('BrigadesService', () => {
  let service: BrigadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrigadesService],
    }).compile();

    service = module.get<BrigadesService>(BrigadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
