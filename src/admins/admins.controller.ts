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
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthService } from '../core/auth';
import { createHash } from 'crypto';

@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
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
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
