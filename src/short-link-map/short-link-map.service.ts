import { Injectable } from '@nestjs/common';
import { ShortCode } from 'src/short-link/entities/short-link.entity';
import { ShortCodeMap } from './entities/link-map.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ShortLinkMapService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  mapShortLink(shortCode: ShortCode, url: string) {
    const linkMap = new ShortCodeMap();
    linkMap.shortCodeId = shortCode.id;
    linkMap.originalUrl = url;
    return linkMap;
  }

  async getShortLinkMapByShortCodeId(shortCodeId: number) {
    return await this.entityManager.findOne(ShortCodeMap, {
      where: { shortCodeId },
      select: ['originalUrl'],
    });
  }
}
