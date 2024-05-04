import { Module } from '@nestjs/common';
import { ShortCodeService } from './short-link.service';
import { ShortCodeController } from './short-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortCode } from './entities/short-link.entity';
import { ShortLinkMapModule } from 'src/short-link-map/short-link-map.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortCode]), ShortLinkMapModule],
  controllers: [ShortCodeController],
  providers: [ShortCodeService],
  exports: [ShortCodeService],
})
export class ShortCodeModule { }
