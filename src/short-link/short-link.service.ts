import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { genShortCode } from 'src/utils/generate-short-code';
import { SharePrivateStatus, ShortCodeStatus } from './short-link.type';
import { ShortCode } from './entities/short-link.entity';
import { GenerateShortLinkDto } from 'src/short-link-map/dtos/generate-short-link.dto';
import { ShortCodeMap } from 'src/short-link-map/entities/link-map.entity';
import { ListShortCodeDto } from './dto/short-lin.dto';

@Injectable()
export class ShortCodeService {
  @InjectRepository(ShortCode)
  private readonly shortCodeRepository: Repository<ShortCode>;
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

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
          const { id: shortCodeId } =
            await transactionalEntityManager.save(shortCode);
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
      data: res[0],
      total: res[1],
    };
  }
}
