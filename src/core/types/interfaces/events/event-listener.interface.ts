import { EventMessageType } from './event-message.type';

export interface IEventListener<T> {
  onEventRaised(data: EventMessageType<T>): void;
}
