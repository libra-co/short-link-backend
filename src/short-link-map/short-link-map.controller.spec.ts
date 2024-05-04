import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkMapController } from './short-link-map.controller';
import { ShortLinkMapService } from './short-link-map.service';

describe('ShortLinkMapController', () => {
  let controller: ShortLinkMapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortLinkMapController],
      providers: [ShortLinkMapService],
    }).compile();

    controller = module.get<ShortLinkMapController>(ShortLinkMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
