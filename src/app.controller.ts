import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortCodeService } from './short-link/short-link.service';
import { ShortLinkMapService } from './short-link-map/short-link-map.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ShortCodeService)
    private readonly shortCodeService: ShortCodeService,
    @Inject(ShortLinkMapService)
    private readonly shortLinkMapService: ShortLinkMapService,
  ) { }
}
