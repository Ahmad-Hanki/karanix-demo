import { Test, TestingModule } from '@nestjs/testing';
import { PaxService } from './pax.service';

describe('PaxService', () => {
  let service: PaxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaxService],
    }).compile();

    service = module.get<PaxService>(PaxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
