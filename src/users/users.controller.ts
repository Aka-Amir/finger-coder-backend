import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Ip,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { lastValueFrom, map, mergeMap, tap, zip } from 'rxjs';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenData } from 'src/core/decorators/token.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';
import { KavehnegarService } from 'src/core/sdk/kavehnegar/kavehnegar.service';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { randomCodeGenerator } from '../core/helpers/random-generator.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userKeyGenerator } from './helpers/user-key-generator.helper';
import { IUserToken } from './types/user-token.interface';
import { UserKeyGuard } from './user-key.guard';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { TokensService } from 'src/core/services/tokens';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: TokensService<IUserToken, IUserToken>,
    private readonly usersService: UsersService,
    private readonly otpService: KavehnegarService,
    private readonly httpClient: HttpService,
  ) {}

  @Get('github')
  async githubAuth(@Query('code') code: string) {
    return this.httpClient
      .post(
        'https://github.com/login/oauth/access_token',
        {
          code,
          client_id: 'Ov23ctBC8lULWJpUEBcp',
          client_secret: '033ab8c8330abcb82bcc4eac9aa00707155fd2f1',
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .pipe(
        mergeMap((data) => {
          return zip(
            this.httpClient
              .get('https://api.github.com/user', {
                headers: {
                  Authorization: 'Bearer ' + data.data.access_token,
                },
                params: {
                  access_token: data.data.access_token,
                },
              })
              .pipe(
                map((response) => response.data),
                tap((data) => console.log(data)),
              ),
            this.httpClient
              .get('https://api.github.com/user/emails', {
                headers: {
                  Authorization: 'Bearer ' + data.data.access_token,
                },
                params: {
                  access_token: data.data.access_token,
                },
              })
              .pipe(
                map((response) => response.data),
                tap((data) => console.log(data)),
              ),
          );
        }),
      );
  }

  @Post('otp')
  @HttpCode(200)
  @Public()
  async sendOtpToUser(
    @Body() data: SendOtpDto,
    @Headers('user-agent') client: string,
    @Ip() ip: string,
  ) {
    const user = await this.usersService.findByPhoneNumber(data.phoneNumber);
    const otpCode = randomCodeGenerator(4);

    const userKey = userKeyGenerator(data.phoneNumber, otpCode);
    const userSign = !user?.id
      ? undefined
      : userKeyGenerator(data.phoneNumber, user.id.toString());

    const accessToken = await this.authService.getAccessToken({
      client,
      ip,
      id: user?.id || undefined,
      userKey,
      phoneNumber: data.phoneNumber,
      tokenType: TokenType.otpCode,
      userSign,
    });

    if (process.env.NODE_ENV === 'DEV') {
      Logger.debug(
        `${user?.phoneNumber || data.phoneNumber} :: ${otpCode}`,
        UsersController.name,
      );
    } else {
      await lastValueFrom(
        this.otpService.sendOtp({
          code: otpCode,
          phoneNumber: user?.phoneNumber || data.phoneNumber,
          templateId: process.env.OTP_TEMPLATE_ID,
        }),
      );
    }

    return {
      code: 'CODE_SENT',
      user,
      accessToken,
    };
  }

  @Post('verify')
  @Access(TokenType.otpCode)
  @UseGuards(AccessGuard, new UserKeyGuard<OtpVerifyDto>('phoneNumber', 'code'))
  async verfiy(@TokenData() token: IUserToken) {
    delete (token as any).exp;
    delete (token as any).iat;
    const accessToken = await this.authService.getAccessToken({
      ...token,
      tokenType: TokenType.commonUser,
    });

    return {
      code: 'USER_LOGGED_IN',
      accessToken,
    };
  }

  @Post()
  @Access(TokenType.otpCode)
  @UseGuards(
    AccessGuard,
    new UserKeyGuard<CreateUserDto>('phoneNumber', 'code'),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @TokenData() token: IUserToken,
  ) {
    if (token.id) {
      throw new ConflictException();
    }
    delete createUserDto.code;

    const user = await this.usersService.create(createUserDto);

    delete (token as any).exp;
    delete (token as any).iat;
    const accessToken = await this.authService.getAccessToken({
      ...token,
      tokenType: TokenType.commonUser,
    });

    return {
      code: 'USER_LOGGED_IN',
      user,
      accessToken,
    };
  }

  @Get()
  @UseGuards(AccessGuard)
  @Access(TokenType.access)
  findAll(
    @Query('fullName') fullName?: string,
    @Query('phoneNumber') phoneNumber?: string,
  ) {
    return this.usersService.findAll({
      fullName,
      phoneNumber,
    });
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @Access(TokenType.access)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @Access(TokenType.access)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @Access(TokenType.access)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
