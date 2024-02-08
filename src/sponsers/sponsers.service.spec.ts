import { Test, TestingModule } from '@nestjs/testing';
import { SponsersService } from './sponsers.service';

describe('SponsersService', () => {
  let service: SponsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SponsersService],
    }).compile();

    service = module.get<SponsersService>(SponsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
