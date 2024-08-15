import { JwtService } from '@nestjs/jwt';
import { ITokenModel } from '../../types/interfaces/tokens/token-model.interface';
import { Injectable } from '@nestjs/common';
import { randomBytes, createCipheriv } from 'crypto';

type TokenType<T> = T & {
  exp: number;
  iat: number;
};

@Injectable()
export class TokensService<
  TAccessToken extends ITokenModel = ITokenModel,
  TRefreshToken extends ITokenModel = TAccessToken,
> {
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(private readonly jwtService: JwtService) {
    this.iv = randomBytes(16);
    this.key = randomBytes(32);
  }

  private encryptString(key: string) {
    if (process.env.NODE_ENV !== 'PROD') {
      return key;
    }

    const cipher = createCipheriv('aes-256-gcm', this.key, this.iv);
    let newKey = cipher.update(key, 'utf-8', 'hex');
    newKey += cipher.final('hex');
    return newKey;
  }

  private decryptString(key: string) {
    if (process.env.NODE_ENV !== 'PROD') {
      return key;
    }

    const cipher = createCipheriv('aes-256-gcm', this.key, this.iv);
    let newKey = cipher.update(key, 'hex', 'utf-8');
    newKey += cipher.final('utf-8');
    return newKey;
  }

  private decryptPayload(payload: Record<string, string>) {
    const decryptedPayload: Record<string, any> = {};
    for (const key of Object.keys(payload)) {
      const newKey = this.decryptString(key);
      const newValue = this.decryptString(
        payload[key]?.toString() || `${payload[key]}`,
      );
      const numberValue = Number(newValue);
      decryptedPayload[newKey] =
        newValue.startsWith('0') || Number.isNaN(numberValue)
          ? newValue
          : numberValue;
    }
    return decryptedPayload;
  }

  encryptPayload(payload: Record<string, any>) {
    const encryptedPayload: Record<string, string> = {};
    for (const key of Object.keys(payload)) {
      const newKey = this.encryptString(key);
      const newValue = this.encryptString(
        payload[key]?.toString() || `${payload[key]}`,
      );
      encryptedPayload[newKey] = newValue;
    }
    return encryptedPayload;
  }

  async getAccessToken(data: TAccessToken): Promise<string> {
    const payload = this.encryptPayload(data);
    return this.jwtService.signAsync(
      { ...payload, policy: 'figercoder' },
      {
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    );
  }

  async getRefreshToken(data: TRefreshToken): Promise<string> {
    const payload = this.encryptPayload(data);
    return this.jwtService.signAsync(
      { ...payload, policy: 'figercoder' },
      {
        algorithm: 'HS512',
        expiresIn: '4h',
      },
    );
  }

  async validate(
    data: string,
  ): Promise<TokenType<TAccessToken | TRefreshToken>> {
    return this.jwtService
      .verifyAsync(data, {
        algorithms: ['HS512', 'HS256'],
      })
      .then((response) => {
        console.log(response);
        delete response.iat;
        delete response.exp;
        delete response.policy;
        const payload = this.decryptPayload(response) as TokenType<
          TAccessToken | TRefreshToken
        >;

        console.log(payload);

        return payload;
      });
  }
}
