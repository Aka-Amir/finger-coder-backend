import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserInfo } from './types/user-info.type';

@Injectable()
export class GoogleSDKService {
  constructor(private readonly httpService: HttpService) {}

  public getUserInfo(token: string): Observable<UserInfo> {
    const URL =
      'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token;
    return this.httpService.get<UserInfo>(URL).pipe(map((data) => data.data));
  }
}
