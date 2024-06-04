import { Test, TestingModule } from '@nestjs/testing';
import { VisitDateRecordService } from './visit-date-record.service';

describe('VisitDateRecordService', () => {
  let service: VisitDateRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitDateRecordService],
    }).compile();

    service = module.get<VisitDateRecordService>(VisitDateRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
