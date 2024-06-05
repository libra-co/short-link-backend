import { SharePrivateStatus } from 'src/short-link/short-link.type';

export class GenerateShortLinkDto {
  url: string;
  privateSharePrompt?: string;
  privateSharePassword?: string;
  visitLimit?: SharePrivateStatus;
  note?: string;
}
