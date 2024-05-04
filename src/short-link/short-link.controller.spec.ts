import { Test, TestingModule } from '@nestjs/testing';
import { ShortCodeController } from './short-link.controller';
import { ShortCodeService } from './short-link.service';

describe('ShortCodeController', () => {
  let controller: ShortCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortCodeController],
      providers: [ShortCodeService],
    }).compile();

    controller = module.get<ShortCodeController>(ShortCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
