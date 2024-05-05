import { PaginationDto } from 'src/common/types/common.type';
import { SharePrivateStatus, ShortCodeStatus } from '../short-link.type';

export interface ListShortCodeDto extends PaginationDto {
  shortCode?: string;
  status?: ShortCodeStatus;
  privateShare?: SharePrivateStatus;
}
