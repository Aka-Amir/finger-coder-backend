import { ITokenModel } from '../../core/types/interfaces/tokens/token-model.interface';

export interface IAdminAccessToken extends ITokenModel {
  id: string;
  superUser: boolean;
  username: string;
  email: string;
}
