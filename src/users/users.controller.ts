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
  UseGuards,
} from '@nestjs/common';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { AuthGuard, AuthService } from '../core/auth';
import { randomCodeGenerator } from '../core/helpers/random-generator.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userKeyGenerator } from './helpers/user-key-generator.helper';
import { IUserToken } from './types/user-token.interface';
import { UserKeyGuard } from './user-key.guard';
import { UsersService } from './users.service';
import { TokenData } from 'src/core/decorators/token.decorator';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { Access } from 'src/core/decorators/access.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService<IUserToken, IUserToken>,
    private readonly usersService: UsersService,
  ) {}

  @Post('otp')
  @HttpCode(200)
  async sendOtpToUser(
    @Body() data: SendOtpDto,
    @Headers('user-agent') client: string,
    @Ip() ip: string,
  ) {
    const user = await this.usersService.findByPhoneNumber(data.phoneNumber);
    const otpCode = randomCodeGenerator(4);

    // TODO: send otp code to user
    Logger.debug(
      `[${otpCode}]::${user?.phoneNumber || data.phoneNumber}`,
      UsersController.name,
    );

    const userKey = userKeyGenerator(data.phoneNumber, otpCode);
    const userSign = !user.id
      ? undefined
      : userKeyGenerator(data.phoneNumber, user.id.toString());

    const accessToken = await this.authService.getAccessToken({
      client,
      ip,
      id: user.id || undefined,
      userKey,
      phoneNumber: data.phoneNumber,
      tokenType: TokenType.otpCode,
      userSign,
    });

    return {
      code: 'CODE_SENT',
      user,
      accessToken,
    };
  }

  @Post('verfiy')
  @Access(TokenType.otpCode)
  @UseGuards(
    AuthGuard,
    AccessGuard,
    new UserKeyGuard<OtpVerifyDto>('phoneNumber', 'code'),
  )
  async verfiy(@TokenData() token: IUserToken) {
    delete (token as any).exp;
    delete (token as any).iat;
    const accessToken = await this.authService.getAccessToken({
      ...token,
      tokenType: TokenType.commonUser,
    });

    return {
      accessToken,
    };
  }

  @Post()
  @Access(TokenType.otpCode)
  @UseGuards(
    AuthGuard,
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
  @UseGuards(AuthGuard, AccessGuard)
  @Access(TokenType.access)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, AccessGuard)
  @Access(TokenType.access)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AccessGuard)
  @Access(TokenType.access)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AccessGuard)
  @Access(TokenType.access)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
