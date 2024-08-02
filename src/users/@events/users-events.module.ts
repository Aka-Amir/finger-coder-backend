import { DynamicModule } from '@nestjs/common';
import { CreateUserEvent } from './create-user.event';

export class UsersEventModule {
  public static events = {
    createUser: 'USER_CREATE_EVENT',
  };

  private static getModule(global: boolean): DynamicModule {
    return {
      module: UsersEventModule,
      global,
      providers: [
        {
          provide: UsersEventModule.events.createUser,
          useValue: new CreateUserEvent(),
        },
      ],
      exports: [UsersEventModule.events.createUser],
    };
  }

  static forRoot(): DynamicModule {
    return UsersEventModule.getModule(true);
  }
  static forFeature(): DynamicModule {
    return UsersEventModule.getModule(false);
  }
}
