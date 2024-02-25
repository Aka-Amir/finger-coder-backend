import {
  Body,
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
      tokenType: TokenType.commonUser,
      userSign,
    });

    return {
      code: 'CODE_SENT',
      user,
      accessToken,
    };
  }

  @Post()
  @UseGuards(AuthGuard, new UserKeyGuard<CreateUserDto>('phoneNumber', 'code'))
  async create(
    @Body() createUserDto: CreateUserDto,
    // @TokenData() token: IUserToken,
  ) {
    delete createUserDto.code;
    const user = await this.usersService.create(createUserDto);

    return {
      code: 'CODE_SENT',
      user,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
