import { MessageContentTemplate, MessageContentTemplateProps, MessageTypeEnum, UrlUnavailableMessageProps } from "./message.type";

export const messageContentTemplate: MessageContentTemplate = (type: MessageTypeEnum, props: MessageContentTemplateProps) => {
  switch (type) {
    case MessageTypeEnum.Expired:
      return "The link has expired";
    case MessageTypeEnum.LimitAttached:
      return "The link has reached the limit of attached";
    case MessageTypeEnum.OutOfVisitLimit:
      return "The link has reached the limit of visit";
    case MessageTypeEnum.UrlUnavailable:
      if (props) {
        const { shortCode } = props as UrlUnavailableMessageProps;
        return `The link is unavailable, with short code ${shortCode}`;
      } else {
        return "UrlUnavailable message props are required";
      }
    default:
      return "Unknown message";
  }
};

