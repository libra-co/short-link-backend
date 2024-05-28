export enum MessageTypeEnum {
  Expired = 0,
  LimitAttached = 1,
  OutOfVisitLimit = 2,
  UrlUnavailable = 3,
}

export enum MessageReadStatusEnum {
  Unread = 0,
  Read = 1,
}

export type ExpiredMessageProps = {};
export type LimitAttachedMessageProps = Record<string, any>;
export type OutOfVisitLimitMessageProps = {};
export type UrlUnavailableMessageProps = { shortCode: string; };


export interface MessageContentTemplate {
  (type: MessageTypeEnum.Expired, props: ExpiredMessageProps): string;
  (type: MessageTypeEnum.LimitAttached, props: LimitAttachedMessageProps): string;
  (type: MessageTypeEnum.OutOfVisitLimit, props: OutOfVisitLimitMessageProps): string;
  (type: MessageTypeEnum.UrlUnavailable, props: UrlUnavailableMessageProps): string;
}

export type MessageContentTemplateProps = UrlUnavailableMessageProps | LimitAttachedMessageProps | OutOfVisitLimitMessageProps;
