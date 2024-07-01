import { PaginationInterface } from 'src/common/types/common.type';
import { SharePrivateStatus, ShortCodeStatus } from '../short-link.type';

export interface AddShortLinkDto {
  url: string,
  note?: string,
}

export interface ListShortCodeDto extends PaginationInterface {
  shortCode?: string;
  status?: ShortCodeStatus;
  privateShare?: SharePrivateStatus;
}

export interface ChangeStatusDto {
  id?: number;
  shortCode?: string;
  status: ShortCodeStatus;
}

export interface DeleteShortCodeByIdDto {
  id: number
}

