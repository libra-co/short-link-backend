import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { genShortCode } from 'src/utils/generate-short-code';
import { SharePrivateStatus, ShortCodeStatus } from './short-link.type';
import { ShortCode } from './entities/short-link.entity';
import { GenerateShortLinkDto } from 'src/short-link-map/dtos/generate-short-link.dto';
import { ShortCodeMap } from 'src/short-link-map/entities/link-map.entity';
import { ChangeStatusDto, DeleteShortCodeByIdDto, ListShortCodeDto } from './dto/short-lin.dto';
import { DeleteStatus } from 'src/common/types/common.type';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
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
  async genShortLink(
    options: Omit<GenerateShortLinkDto, 'url'>,
  ): Promise<ShortCode>;
  async genShortLink(
    options?: Omit<GenerateShortLinkDto, 'url'>,
  ): Promise<ShortCode> {
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
    }
    return shortCodeEntity;
  }

  // save short code and link map into the database
  async createShortLink(shortCode: ShortCode, linkMap: ShortCodeMap) {
    try {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const { id: shortCodeId } = await transactionalEntityManager.save(shortCode);
          linkMap.shortCodeId = shortCodeId;
          await transactionalEntityManager.save(linkMap);
        },
      );
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to save short link',
      };
    }
    return {
      code: HttpStatus.OK,
      data: {
        shortCode: shortCode.shortCode,
      },
      message: 'Short link saved successfully',
    };
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
    return {
      data: {
        data: res[0],
        total: res[1],
      },
      code: HttpStatus.OK,
      message: 'Short code list fetched successfully',
    };
  }

  async changeStatus({ id, shortCode, status }: ChangeStatusDto) {
    // Check if the id or short code both not provided
    if (!id && !shortCode) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: 'Id or short code is required',
      };
    }
    // If the id is not provided, then find the short code by the short code
    const shortCodeEntity = await this.shortCodeRepository.findOne({
      where: { shortCode, id },
    });
    if (!shortCodeEntity) {
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Short code not found',
      };
    }
    shortCodeEntity.status = status;
    await this.shortCodeRepository.save(shortCodeEntity);
    return {
      code: HttpStatus.OK,
      data: {
        shortCode: shortCodeEntity.shortCode,
      },
      message: 'Short code status updated successfully',
    };
  }

  async getShortCodeById(id: number) {
    return this.shortCodeRepository.findOneBy({ id });
  }

  /**
   * 1. Mark `isDelete` field as Delete in Mysql
   * 2. Add deleted id in RedisDeletedShortCodeIdList list in Redis
   */
  async deleteShortCodeById({ id }: DeleteShortCodeByIdDto) {
    const shortCodeEntity = await this.shortCodeRepository.findOneBy({ id })
    if (!shortCodeEntity) throw new Error('Short code not found')
    // Mark `isDelete` field as Delete
    shortCodeEntity.isDelete = DeleteStatus.Delete
    await this.shortCodeRepository.save(shortCodeEntity)
    // Add deleted id in RedisDeletedShortCodeIdList list in Redis
    await this.redis.sadd(RedisDeletedShortCodeIdList, id)
  }
}
