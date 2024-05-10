import { Test, TestingModule } from '@nestjs/testing';
import { VisitRecordController } from './visit-record.controller';
import { VisitRecordService } from './visit-record.service';

describe('VisitRecordController', () => {
  let controller: VisitRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitRecordController],
      providers: [VisitRecordService],
    }).compile();

    controller = module.get<VisitRecordController>(VisitRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
