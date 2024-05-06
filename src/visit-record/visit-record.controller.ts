import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Ip,
  Inject,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VisitRecordService } from './visit-record.service';
import { CreateVisitRecordDto } from './dto/visit-record.dto';
import { ShortCodeService } from 'src/short-link/short-link.service';
import { ShortLinkMapService } from 'src/short-link-map/short-link-map.service';

@Controller('visit-record')
export class VisitRecordController {
  constructor(
    private readonly visitRecordService: VisitRecordService,
    @Inject(ShortCodeService)
    private readonly shortCodeService: ShortCodeService,
    @Inject(ShortLinkMapService)
    private readonly shortLinkMapService: ShortLinkMapService,
  ) {}

  @Post('record/:shortCode')
  async create(
    @Param('shortCode') shortCode: string,
    @Body() createVisitRecordDto: CreateVisitRecordDto,
    @Ip() ip: string,
  ) {
    const shortCodeEntity =
      await this.shortCodeService.getShortCodeByCode(shortCode);
    if (!shortCodeEntity)
      return {
        code: HttpStatus.BAD_REQUEST,
        message: 'Short code not found',
      };

    const shortLinkMapEntity =
      await this.shortLinkMapService.getShortLinkMapByShortCodeId(
        shortCodeEntity.id,
      );
    if (!shortLinkMapEntity)
      return {
        code: HttpStatus.BAD_REQUEST,
        message: 'Short code not found',
      };

    const visitRecord = await this.visitRecordService.genVisitRecord({
      ...createVisitRecordDto,
      ip,
      shortCodeId: shortCodeEntity.id,
    });
    await this.visitRecordService.createVisitRecord(visitRecord);

    return {
      url: shortLinkMapEntity.originalUrl,
      code: HttpStatus.PERMANENT_REDIRECT,
    };
  }

  @Get('detail')
  async getShortCodeVisitDetailById(@Query('id') id: string) {
    return this.visitRecordService.getShortCodeVisitDetailById(+id);
  }

  @Get('ip/:ip')
  async getIpLocation(@Param('ip') ip: string) {
    return this.visitRecordService.getIpLocation(ip);
  }
}
