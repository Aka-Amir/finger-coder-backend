import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Ip,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { TokenData } from '../../core/decorators/token.decorator';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IAdminAccessToken } from './types/admin-access-token.interface';
import { IAdminRefreshToken } from './types/admin-refresh-token.interface';
import { Access } from 'src/core/decorators/access.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';
import { Public } from 'src/core/decorators/public.decorator';
import { TokensService } from 'src/core/services/tokens';

@Controller('admins')
@Access(TokenType.access)
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly authService: TokensService<
      IAdminAccessToken,
      IAdminRefreshToken
    >,
  ) {}

  @Post()
  // @UseGuards(AccessGuard)
  create(@Body() createAdminDto: CreateAdminDto) {
    createAdminDto.password = createHash('MD5')
      .update(createAdminDto.password)
      .digest('hex');
    return this.adminsService.create(createAdminDto);
  }

  @Post('login')
  @Public()
  async login(
    @Body() loginAdminDto: LoginAdminDto,
    @Ip() ip: string,
    @Headers('User-Agent') client: string,
  ) {
    if (!ip || !client) {
      throw new BadRequestException();
    }
    loginAdminDto.password = createHash('MD5')
      .update(loginAdminDto.password)
      .digest('hex');

    const model = await this.adminsService.findByUsernameOrEmail(
      loginAdminDto.usernameOrEmail,
    );

    if (!model) throw new NotFoundException();

    if (model.password !== loginAdminDto.password) {
      throw new ForbiddenException();
    }

    const accessToken = await this.authService.getAccessToken({
      id: model.id,
      tokenType: TokenType.access,
      superUser: model.superAdmin,
      username: model.username,
      email: model.email,
    });

    const refreshToken = await this.authService.getRefreshToken({
      id: model.id,
      ip,
      client,
      tokenType: TokenType.refresh,
    });

    return {
      id: model.id,
      email: model.email,
      username: model.username,
      refreshToken,
      accessToken,
    };
  }

  @Get()
  // @UseGuards(AccessGuard)
  findAll(@TokenData('superUser') superUser: boolean) {
    if (!superUser) throw new ForbiddenException();
    return this.adminsService.findAll();
  }

  @Get(':id')
  // @UseGuards(AccessGuard)
  findOne(
    @Param('id') id: string,
    @TokenData('superUser') superUser: boolean,
    @TokenData('id') adminID: string,
  ) {
    if (adminID !== id && !superUser) throw new ForbiddenException();
    return this.adminsService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  // @UseGuards(AccessGuard)
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @TokenData('superUser') superUser: boolean,
    @TokenData('id') adminID: string,
  ) {
    if (adminID !== id && !superUser) throw new ForbiddenException();

    if (updateAdminDto.password) {
      updateAdminDto.password = createHash('MD5')
        .update(updateAdminDto.password)
        .digest('hex');
    }
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  // @UseGuards(AccessGuard)
  remove(
    @Param('id') id: string,
    @TokenData('superUser') superUser: boolean,
    @TokenData('id') adminID: string,
  ) {
    if (!superUser) throw new ForbiddenException();
    if (adminID === id)
      throw new ForbiddenException(
        'Super user admin is not allowed to be removed',
      );
    return this.adminsService.remove(id);
  }
}
