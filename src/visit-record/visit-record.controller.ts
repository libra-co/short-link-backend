import { Controller, Get, Post, Body, Param, Ip, Inject, HttpStatus, Query, Headers, } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { VisitRecordService } from './visit-record.service';
import { CreateVisitRecordDto } from './dto/visit-record.dto';
import { ShortCodeService } from 'src/short-link/short-link.service';
import { ShortLinkMapService } from 'src/short-link-map/short-link-map.service';
import { decryptVisitRecordId, encryptVisitRecordId } from 'src/utils/crypto';
import { MessageService } from 'src/message/message.service';
import { MessageTypeEnum } from 'src/message/message.type';
import { messageContentTemplate } from 'src/message/utils';
import { VisitDateRecordService } from 'src/visit-date-record/visit-date-record.service';
import { BasicResponse } from 'src/common/types/common.type';
import { GetDashBoardDataVo, GetIpLocationVo, GetShortCodeCountStatisticsVo, GetShortCodeVisitDetailByIdVo } from './vo/visit-record.vo';

@Controller('visit-record')
export class VisitRecordController {
  constructor(
    private readonly visitRecordService: VisitRecordService,
    @Inject(ShortCodeService)
    private readonly shortCodeService: ShortCodeService,
    @Inject(ShortLinkMapService)
    private readonly shortLinkMapService: ShortLinkMapService,
    @Inject(MessageService)
    private readonly messageService: MessageService,
    @InjectRedis()
    private readonly redis: Redis,
    @Inject(VisitDateRecordService)
    private readonly visitDateRecordService: VisitDateRecordService,
  ) { }

  @Post('record/:shortCode')
  async create(
    @Param('shortCode') shortCode: string,
    @Body() createVisitRecordDto: CreateVisitRecordDto,
    @Ip() ip: string,
    @Headers('X-Forwarded-For') xForwardedFor: string, // Set Header X-Forwarded-For to get real IP If u use Nginx
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
      ip: xForwardedFor || ip,
      shortCodeId: shortCodeEntity.id,
    });

    const recordEntity = await this.visitRecordService.createVisitRecord(visitRecord);
    let recordId = encryptVisitRecordId(recordEntity.id);

    // Update short code visit count
    await this.visitDateRecordService.recordVisitInRedis(shortCodeEntity.id, shortCodeEntity.shortCode);
    return {
      data: {
        url: shortLinkMapEntity.originalUrl,
        recordId: recordId,
      },
      code: HttpStatus.PERMANENT_REDIRECT,
    };
  }

  @Get('access-failed/:recordId')
  async updateAccessStatus(
    @Param('recordId') recordId: string
  ) {
    const id = decryptVisitRecordId(recordId);
    console.log('id', id);
    if (!id) return {
      code: HttpStatus.BAD_REQUEST,
      message: 'Invalid record id',
    };
    const visitRecordEntity = await this.visitRecordService.updateFailedAccessRecord(id);

    if (!visitRecordEntity) return {
      code: HttpStatus.BAD_REQUEST,
      message: 'Record not found',
    };

    const shortCode = await this.shortCodeService.getShortCodeById(visitRecordEntity.shortCodeId);
    if (!shortCode) return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Not found short code'
    };

    const failedMessage = {
      linkRecordId: visitRecordEntity.id,
      shortCodeId: visitRecordEntity.shortCodeId,
      shortCode: shortCode.shortCode,
      type: MessageTypeEnum.UrlUnavailable,
      content: messageContentTemplate(MessageTypeEnum.UrlUnavailable, { shortCode: shortCode.shortCode })
    };
    const accessFailedMessage = await this.messageService.generateMessage(failedMessage);
    await this.messageService.createMessage(accessFailedMessage);
    return {
      code: HttpStatus.OK,
      message: 'Access failed record updated successfully',
    };
  }

  @Get('detail')
  async getShortCodeVisitDetailById(
    @Query('id') id: string
  ): BasicResponse<GetShortCodeVisitDetailByIdVo> {
    try {
      const data = await this.visitRecordService.getShortCodeVisitDetailById(+id);
      return {
        data,
        message: 'Visit detail fetched successfully',
        code: HttpStatus.OK,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal error',
      };
    }
  }

  @Get('ip/:ip')
  async getIpLocation(
    @Param('ip') ip: string
  ): BasicResponse<GetIpLocationVo> {
    try {
      const data = await this.visitRecordService.getIpLocation(ip);
      return {
        data,
        code: HttpStatus.OK,
        message: 'success'
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal error'
      };
    }
  }

  @Get('summaryStatistics')
  async getDashBoardData(): BasicResponse<GetDashBoardDataVo> {
    try {
      const statics = await this.visitDateRecordService.getSummaryStatistics();
      return {
        data: statics,
        code: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal error'
      };
    }
  }

  @Get('shortCodeCountStatistics')
  async getShortCodeCountStatistics(): BasicResponse<GetShortCodeCountStatisticsVo> {
    try {
      const statistics = await this.shortCodeService.getAvailableLinkAndTotalCount()
      return {
        data: statistics,
        code: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Internal error'
      };
    }
  }

  
}
