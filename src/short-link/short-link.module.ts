import { Module } from '@nestjs/common';
import { ShortCodeService } from './short-link.service';
import { ShortCodeController } from './short-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortCode } from './short-link.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([ShortCode])],
  controllers: [ShortCodeController],
  providers: [ShortCodeService],
})
export class ShortCodeModule {}
