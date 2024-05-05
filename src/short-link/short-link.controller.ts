import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';

import { ShortCodeService } from './short-link.service';
import { ShortLinkMapService } from 'src/short-link-map/short-link-map.service';
import { GenerateShortLinkDto } from 'src/short-link-map/dtos/generate-short-link.dto';
import { ChangeStatusDto, ListShortCodeDto } from './dto/short-lin.dto';
import { SharePrivateStatus, ShortCodeStatus } from './short-link.type';

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
  ) {
    const query: ListShortCodeDto = {
      page: +page,
      pageSize: +pageSize,
      shortCode: shortCode,
      status: status ? (+status as ShortCodeStatus) : undefined,
      privateShare: privateShare
        ? (+privateShare as SharePrivateStatus)
        : undefined,
    };
    return await this.shortCodeService.listShortCode(query);
  }

  @Post('changeStatus')
  async changeStatus(@Body() changeStatusDto: ChangeStatusDto) { }

  @Get('visitDetail')
  async visitDetail(@Query('id') id: string) { }

  @Get()
  async genShortLink(@Query('url') url: string) {
    const shortCode = await this.shortCodeService.genShortLink();
    const linkMap = this.shortLinkMapService.mapShortLink(shortCode, url);
    return await this.shortCodeService.createShortLink(shortCode, linkMap);
  }

  @Post()
  async genPrivateShortLink(
    @Body() genPrivateShortLinkDto: GenerateShortLinkDto,
  ) {
    const { url, ...options } = genPrivateShortLinkDto;
    const shortCode = await this.shortCodeService.genShortLink(options);
    const linkMap = this.shortLinkMapService.mapShortLink(shortCode, url);
    return await this.shortCodeService.createShortLink(shortCode, linkMap);
  }
}
