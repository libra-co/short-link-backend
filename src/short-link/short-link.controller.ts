import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';

import { ShortCodeService } from './short-link.service';
import { ShortLinkMapService } from 'src/short-link-map/short-link-map.service';
import { GenerateShortLinkDto } from 'src/short-link-map/dtos/generate-short-link.dto';

@Controller('short-code')
export class ShortCodeController {
  constructor(
    private readonly shortCodeService: ShortCodeService,
    @Inject(ShortLinkMapService)
    private readonly shortLinkMapService: ShortLinkMapService,
  ) { }

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
