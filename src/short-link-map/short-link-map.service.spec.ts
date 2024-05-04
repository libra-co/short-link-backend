import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinkMapService } from './short-link-map.service';

describe('ShortLinkMapService', () => {
  let service: ShortLinkMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortLinkMapService],
    }).compile();

    service = module.get<ShortLinkMapService>(ShortLinkMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
