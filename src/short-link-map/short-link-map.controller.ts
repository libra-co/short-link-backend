import { Controller, Get, Inject, Post, Query, Body } from '@nestjs/common';
import { ShortLinkMapService } from './short-link-map.service';

@Controller('link-map')
export class ShortLinkMapController {
  constructor(
    private readonly shortLinkMapService: ShortLinkMapService,
  ) { }

}
