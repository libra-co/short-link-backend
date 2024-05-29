import { Test, TestingModule } from '@nestjs/testing';
import { VisitDateRecordController } from './visit-date-record.controller';
import { VisitDateRecordService } from './visit-date-record.service';

describe('VisitDateRecordController', () => {
  let controller: VisitDateRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitDateRecordController],
      providers: [VisitDateRecordService],
    }).compile();

    controller = module.get<VisitDateRecordController>(VisitDateRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
