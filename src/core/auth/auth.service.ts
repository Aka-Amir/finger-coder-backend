import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService<
  T extends Record<string, any> = Record<string, any>,
  K extends Record<string, any> = T,
> {
  constructor(private readonly jwtService: JwtService) {}

  async getAccessToken(data: T): Promise<string> {
    return this.jwtService.signAsync(data, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  }

  async getRefreshToken(data: K): Promise<string> {
    return this.jwtService.signAsync(data, {
      algorithm: 'HS512',
      expiresIn: '4h',
    });
  }

  async validate(data: string): Promise<T | K> {
    return this.jwtService.verifyAsync(data, {
      algorithms: ['HS512'],
    });
  }
}
