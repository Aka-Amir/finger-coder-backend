import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  Put,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard, AuthService } from '../core/auth';
import { createHash } from 'crypto';
import { TokenData } from 'src/core/decorators/token.decorator';

@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAdminDto: CreateAdminDto) {
    createAdminDto.password = createHash('MD5')
      .update(createAdminDto.password)
      .digest('hex');
    return this.adminsService.create(createAdminDto);
  }

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
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
      superUser: model.superAdmin,
      username: model.username,
      password: model.password,
    });

    const refreshToken = await this.authService.getRefreshToken({
      id: model.id,
      superUser: model.superAdmin,
      username: model.username,
      password: model.password,
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
  @UseGuards(AuthGuard)
  findAll(@TokenData('superUser') superUser: boolean) {
    if (!superUser) throw new ForbiddenException();
    return this.adminsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  remove(
    @Param('id') id: string,
    @TokenData('superUser') superUser: boolean,
    @TokenData('id') adminID: string,
  ) {
    if (adminID !== id && !superUser) throw new ForbiddenException();
    return this.adminsService.remove(id);
  }
}
