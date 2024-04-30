import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { genShortCode } from 'src/utils/generate-short-code';
import { ShortCodeStatus } from './short-link.type';
import { ShortCode } from './short-link.entity';

@Injectable()
export class ShortCodeService {
  // @InjectRepository(ShortCode)
  // private readonly shortCodeRepository: Repository<ShortCode>;

  // async generateShortLink(): Promise<string> {
    // const shortCode = genShortCode();
    // const foundCodeEntity = await this.shortCodeRepository.findOneBy({
    //   shortCode,
    //   status: ShortCodeStatus.DISABLE,
    // });
    // // Check if the short code exist in the database
    // if (!foundCodeEntity) {
    //   const shortCodeEntity = new ShortCode();
    //   shortCodeEntity.shortCode = shortCode;
    //   shortCodeEntity.status = ShortCodeStatus.ENABLE;
    //   await this.shortCodeRepository.insert(shortCodeEntity);
    // } else {
    //   foundCodeEntity.status = ShortCodeStatus.ENABLE;
    //   this.shortCodeRepository.update(foundCodeEntity.id, foundCodeEntity);
    // }
    // return shortCode;
  // }
}
