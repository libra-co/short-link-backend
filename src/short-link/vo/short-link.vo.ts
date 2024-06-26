import { ShortCode } from '../entities/short-link.entity';
import { SharePrivateStatus, ShortCodeStatus } from '../short-link.type';

export interface ListShortCodeVo {
  data: ShortCode[],
  total: number;
}

export interface ChangeStatusVo {
  shortCode: string;
}

export interface GetHotLinkByYearVo {
  id: number;
  shortCode: string;
  status: ShortCodeStatus;
  privateShare: SharePrivateStatus;
  note: string;
}
