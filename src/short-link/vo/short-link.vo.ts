import { ShortCode } from '../entities/short-link.entity';

export interface ListShortCodeVo {
  data: ShortCode[],
  total: number
}

export interface ChangeStatusVo {
  shortCode: string
}
