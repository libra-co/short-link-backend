import { Controller, Get, Query } from '@nestjs/common';

import { ShortCodeService } from './short-link.service';

@Controller('short-code')
export class ShortCodeController {
  constructor(private readonly shortCodeService: ShortCodeService) {}

  @Get()
  async getShortLink(@Query('url') url: string): Promise<string> {
    // const shortCode = await this.shortCodeService.generateShortLink();
    return '123';
  }
}
