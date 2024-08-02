import { Test, TestingModule } from '@nestjs/testing';
import { SponsersController } from './sponsers.controller';
import { SponsersService } from './sponsers.service';

describe('SponsersController', () => {
  let controller: SponsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SponsersController],
      providers: [SponsersService],
    }).compile();

    controller = module.get<SponsersController>(SponsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
