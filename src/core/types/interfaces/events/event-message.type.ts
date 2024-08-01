import { IEventPublisher } from './event-publisher.interface';

export type EventMessageType<T> = T & {
  source: IEventPublisher;
};
