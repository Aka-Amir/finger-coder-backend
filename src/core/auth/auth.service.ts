import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenModel } from '../types/interfaces/tokens/token-model.interface';

@Injectable()
export class AuthService<
  TAccessToken extends ITokenModel = ITokenModel,
  TRefreshToken extends ITokenModel = ITokenModel,
> {
  constructor(private readonly jwtService: JwtService) {}

  async getAccessToken(data: TAccessToken): Promise<string> {
    return this.jwtService.signAsync(data, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  }

  async getRefreshToken(data: TRefreshToken): Promise<string> {
    return this.jwtService.signAsync(data, {
      algorithm: 'HS512',
      expiresIn: '4h',
    });
  }

  async validate(data: string): Promise<TAccessToken | TRefreshToken> {
    return this.jwtService.verifyAsync(data, {
      algorithms: ['HS512', 'HS256'],
    });
  }
}
