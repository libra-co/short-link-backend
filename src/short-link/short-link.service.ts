import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { genShortCode } from 'src/utils/generate-short-code';
import { SharePrivateStatus, ShortCodeStatus } from './short-link.type';
import { ShortCode } from './entities/short-link.entity';
import { GenerateShortLinkDto } from 'src/short-link-map/dtos/generate-short-link.dto';
import { ShortCodeMap } from 'src/short-link-map/entities/link-map.entity';
import { ChangeStatusDto, DeleteShortCodeByIdDto, ListShortCodeDto } from './dto/short-link.dto';
import { DeleteStatus } from 'src/common/types/common.type';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { RedisDeletedShortCodeIdList } from 'src/common/consts/redis';

@Injectable()
export class ShortCodeService {
  @InjectRepository(ShortCode)
  private readonly shortCodeRepository: Repository<ShortCode>;
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  @InjectRedis()
  private readonly redis: Redis;

  async genShortLink(): Promise<ShortCode>;
  async genShortLink(options: Omit<GenerateShortLinkDto, 'url'>): Promise<ShortCode>;
  async genShortLink(options?: Omit<GenerateShortLinkDto, 'url'>): Promise<ShortCode> {
    const shortCode = genShortCode();
    const foundCodeEntity = await this.shortCodeRepository.findOneBy({
      shortCode,
    });
    // Check if the short code exist in the database
    if (foundCodeEntity) return this.genShortLink(options);

    const shortCodeEntity = new ShortCode();
    shortCodeEntity.shortCode = shortCode;
    shortCodeEntity.status = ShortCodeStatus.ENABLE;

    if (options) {
      // If the private share password is set, then the private share status is private
      if (options.privateSharePassword) {
        shortCodeEntity.privateSharePassword = options.privateSharePassword;
        shortCodeEntity.privateSharePrompt = options.privateSharePrompt;
        shortCodeEntity.privateShare = SharePrivateStatus.PRIVATE;
      }
      shortCodeEntity.visitLimit = options.visitLimit || 0;
      shortCodeEntity.note = options.note || '';
    }
    return shortCodeEntity;
  }

  // save short code and link map into the database
  async createShortLink(shortCode: ShortCode, linkMap: ShortCodeMap) {
    const shortCodeEntity = await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const { id: shortCodeId } = await transactionalEntityManager.save(shortCode);
        linkMap.shortCodeId = shortCodeId;
        return await transactionalEntityManager.save(linkMap);
      },
    );
    return shortCodeEntity;
  }

  async getShortCodeByCode(shortCode: string) {
    return this.shortCodeRepository.findOneBy({ shortCode });
  }

  async listShortCode({
    page,
    pageSize,
    shortCode,
    status,
    privateShare,
  }: ListShortCodeDto) {
    const res = await this.shortCodeRepository.findAndCount({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: { shortCode, status, privateShare },
      order: {
        createTime: 'DESC',
      },
      select: [
        'id',
        'shortCode',
        'status',
        'privateShare',
        'privateSharePrompt',
        'privateSharePassword',
        'visitLimit',
      ],
    });

    if (!res) throw new Error('Find short code list failed');
    const [data, total] = res;

    return { data, total, };
  }

  async changeStatus({ id, shortCode, status }: ChangeStatusDto) {
    // Check if the id or short code both not provided
    if (!id && !shortCode) throw new Error('Id or short code is required');
    // If the id is not provided, then find the short code by the short code
    const shortCodeEntity = await this.shortCodeRepository.findOne({
      where: { shortCode, id },
    });
    if (!shortCodeEntity) throw new Error('Short code not found');
    shortCodeEntity.status = status;
    return await this.shortCodeRepository.save(shortCodeEntity);

  }

  async getShortCodeById(id: number) {
    return this.shortCodeRepository.findOneBy({ id });
  }

  /**
   * 1. Mark `isDelete` field as Delete in Mysql
   * 2. Add deleted id in RedisDeletedShortCodeIdList list in Redis
   */
  async deleteShortCodeById({ id }: DeleteShortCodeByIdDto) {
    const shortCodeEntity = await this.shortCodeRepository.findOneBy({ id });
    if (!shortCodeEntity) throw new Error('Short code not found');
    // Mark `isDelete` field as Delete
    shortCodeEntity.isDelete = DeleteStatus.Delete;
    await this.shortCodeRepository.save(shortCodeEntity);
    // Add deleted id in RedisDeletedShortCodeIdList list in Redis
    await this.redis.sadd(RedisDeletedShortCodeIdList, id);
  }
}
