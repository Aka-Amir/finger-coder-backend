import { AppEvent } from 'src/core/utils/event.util';

export class CreateUserEvent extends AppEvent<{ authId: string }> {}
