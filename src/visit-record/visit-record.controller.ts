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
  Headers,
} from '@nestjs/common';
import { VisitRecordService } from './visit-record.service';
import { CreateVisitRecordDto } from './dto/visit-record.dto';
import { ShortCodeService } from 'src/short-link/short-link.service';
import { ShortLinkMapService } from 'src/short-link-map/short-link-map.service';
import { decryptVisitRecordId, encryptVisitRecordId } from 'src/utils/crypto';
import { VisitRecordCryptoSecretKeyIv } from 'config/crypto.config';
import { MessageService } from 'src/message/message.service';
import { MessageTypeEnum } from 'src/message/message.type';
import { messageContentTemplate } from 'src/message/utils';

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
    return {
      data: {
        url: shortLinkMapEntity.originalUrl,
        recordId: recordId,
      },
      code: HttpStatus.PERMANENT_REDIRECT,
    };
  }

  @Get('access-failed/:recordId')
  async updateAccessStatus(@Param('recordId') recordId: string) {
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
  async getShortCodeVisitDetailById(@Query('id') id: string) {
    return this.visitRecordService.getShortCodeVisitDetailById(+id);
  }

  @Get('ip/:ip')
  async getIpLocation(@Param('ip') ip: string) {
    return this.visitRecordService.getIpLocation(ip);
  }
}
