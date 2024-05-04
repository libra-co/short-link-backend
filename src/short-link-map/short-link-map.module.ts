import { Module } from '@nestjs/common';
import { ShortLinkMapService } from './short-link-map.service';
import { ShortLinkMapController } from './short-link-map.controller';

@Module({
  controllers: [ShortLinkMapController],
  providers: [ShortLinkMapService],
  exports: [ShortLinkMapService],
})
export class ShortLinkMapModule {}
