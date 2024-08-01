import { AppEvent } from '../event.util';

export const usersEvent = new AppEvent<{
  authId: string;
}>();
