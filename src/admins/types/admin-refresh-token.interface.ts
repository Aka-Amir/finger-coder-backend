import { ITokenModel } from '../../core/types/interfaces/tokens/token-model.interface';

export interface IAdminRefreshToken extends ITokenModel {
  client: string;
  ip: string;
  id: string;
}
