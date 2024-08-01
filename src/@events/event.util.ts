import { Subject } from 'rxjs';
import { IEventListener } from 'src/core/types/interfaces/events/event-listener.interface';
import { EventMessageType } from 'src/core/types/interfaces/events/event-message.type';
import { IEventPublisher } from 'src/core/types/interfaces/events/event-publisher.interface';

export class AppEvent<T> {
  private readonly _subject: Subject<EventMessageType<T>> = new Subject<
    EventMessageType<T>
  >();

  emit(publisher: IEventPublisher, data: T) {
    this._subject.next({
      ...data,
      source: publisher,
    });
  }

  listen(listener: IEventListener<T>) {
    this._subject.subscribe({
      next: (data) => {
        listener.onEventRaised(data);
      },
    });
  }
}
