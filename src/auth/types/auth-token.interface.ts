import { ITokenModel } from "src/core/types/interfaces/tokens/token-model.interface";
import { AuthTypes } from "./auth-types.enum";

export interface IAuthToken extends ITokenModel {
  key: string,
  phoneNumber: string,
  ip: string,
  client: string,
  id: string
  authType: AuthTypes,
}