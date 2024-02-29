import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { map } from 'rxjs';
import { AuthGuard } from '../core/auth';
import { MediaService } from './media.service';
import { MediaGuard } from './media.guard';
import { AccessGuard } from 'src/core/guards/access.guard';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';

@Access(TokenType.access)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(AuthGuard, AccessGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png|webp)/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.create(file).pipe(
      map((item) => ({
        fileName: item.fileName,
      })),
    );
  }

  @Delete(':file')
  @UseGuards(AuthGuard, AccessGuard, new MediaGuard('file'))
  async delete(@Param('file') file: string) {
    try {
      return this.mediaService.removeFile(file);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  @Get(':file')
  @UseGuards(new MediaGuard('file'))
  async getFile(@Param('file') file: string) {
    try {
      return this.mediaService.getFileStream(file);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}
