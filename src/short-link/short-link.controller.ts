import { Body, Controller, Get, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { ShortCodeService } from './short-link.service';
import { ShortLinkMapService } from 'src/short-link-map/short-link-map.service';
import { GenerateShortLinkDto } from 'src/short-link-map/dtos/generate-short-link.dto';
import { AddShortLinkDto, ChangeStatusDto, DeleteShortCodeByIdDto, ListShortCodeDto } from './dto/short-link.dto';
import { SharePrivateStatus, ShortCodeStatus } from './short-link.type';
import { BasicResponse } from 'src/common/types/common.type';
import { ChangeStatusVo, ListShortCodeVo } from './vo/short-link.vo';

@Controller('short-code')
export class ShortCodeController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
    @Inject(ShortLinkMapService)
    private readonly shortLinkMapService: ShortLinkMapService,
  ) { }

  @Get('list')
  async listShortCode(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('shortCode') shortCode: string,
    @Query('status') status: string,
    @Query('privateShare') privateShare: string,
  ): BasicResponse<ListShortCodeVo> {
    const query: ListShortCodeDto = {
      page: +page,
      pageSize: +pageSize,
      shortCode: shortCode,
      status: status ? (+status as ShortCodeStatus) : undefined,
      privateShare: privateShare
        ? (+privateShare as SharePrivateStatus)
        : undefined,
    };
    try {
      const data = await this.shortCodeService.listShortCode(query);
      return {
        data,
        code: HttpStatus.OK,
        message: 'Short code list fetched successfully',
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Short code list fetched unsuccessfully'
      };
    }
  }

  @Post('change-status')
  async changeStatus(@Body() changeStatusDto: ChangeStatusDto): BasicResponse<ChangeStatusVo> {
    try {
      const { shortCode } = await this.shortCodeService.changeStatus(changeStatusDto);
      if (!shortCode) throw new Error();
      return {
        code: HttpStatus.OK,
        data: { shortCode },
        message: 'Short code status updated successfully',
      };
    } catch ({ message }) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: message || 'Internal error',
      };
    }
  }

  @Post()
  async genShortLink(@Body() body: AddShortLinkDto): BasicResponse {
    const { url, note } = body;
    try {
      const shortCode = await this.shortCodeService.genShortLink({ note });
      const linkMap = this.shortLinkMapService.mapShortLink(shortCode, url);
      await this.shortCodeService.createShortLink(shortCode, linkMap);
      return {
        code: HttpStatus.OK,
        message: 'Short link create successfully',
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Failed to create short link',
      };
    }
  }

  @Post()
  async genPrivateShortLink(
    @Body() genPrivateShortLinkDto: GenerateShortLinkDto,
  ): BasicResponse {
    try {
      const { url, ...options } = genPrivateShortLinkDto;
      const shortCode = await this.shortCodeService.genShortLink(options);
      const linkMap = this.shortLinkMapService.mapShortLink(shortCode, url);
      await this.shortCodeService.createShortLink(shortCode, linkMap);
      return {
        code: HttpStatus.OK,
        message: 'Short link create successfully',
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || 'Failed to create short link',
      };
    }
  }

  @Post('delete')
  async deleteShortLinkById(@Body() body: DeleteShortCodeByIdDto) {
    try {
      await this.shortCodeService.deleteShortCodeById(body);
      return {
        code: HttpStatus.OK,
        message: 'short code delete successfully'
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error
      };
    }
  }

  @Get('getHotLinkByYear')
  async getHotLinkByYear() {
    try {
      const shortCodes = await this.shortCodeService.getHotLinkByYear();
    } catch (error) {

    }
  }
}
