import { ITokenModel } from '../../core/types/interfaces/tokens/token-model.interface';

export interface IUserToken extends ITokenModel {
  client: string;
  ip: string;
  phoneNumber: string;
  userKey: string;
}
