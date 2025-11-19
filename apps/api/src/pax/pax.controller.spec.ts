import { Test, TestingModule } from '@nestjs/testing';
import { PaxController } from './pax.controller';
import { PaxService } from './pax.service';

describe('PaxController', () => {
  let controller: PaxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaxController],
      providers: [PaxService],
    }).compile();

    controller = module.get<PaxController>(PaxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
