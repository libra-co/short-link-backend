import { Test, TestingModule } from '@nestjs/testing';
import { VisitRecordService } from './visit-record.service';

describe('VisitRecordService', () => {
  let service: VisitRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitRecordService],
    }).compile();

    service = module.get<VisitRecordService>(VisitRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
