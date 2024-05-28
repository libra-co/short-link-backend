import { MessageTypeEnum } from "../message.type";

export class CreateMessageDto {
  linkRecordId: number;
  shortCodeId: number;
  shortCode: string;
  type: MessageTypeEnum;
  content: string;
}
