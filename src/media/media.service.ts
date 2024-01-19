import {
  Inject,
  Injectable,
  OnModuleInit,
  StreamableFile,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdirSync, writeFile, existsSync, createReadStream, unlink } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(@Inject('STATIC_PATH') private staticPath: string) {}

  onModuleInit() {
    if (!existsSync(this.staticPath)) mkdirSync(this.staticPath);
  }

  create(file: Express.Multer.File) {
    return new Observable<{ path: string; fileName: string }>((observer) => {
      const uuid = (
        randomUUID({
          disableEntropyCache: true,
        }) as any
      )
        .replaceAll('-', '_')
        .toString();
      const extensions = file.originalname.split('.');
      const fileType = extensions[extensions.length - 1];
      const FILE_NAME = `${uuid}.${fileType}`;
      const PATH = join(this.staticPath, FILE_NAME);

      writeFile(PATH, file.buffer, (err) => {
        if (err) {
          observer.error(err);
          observer.complete();
          return;
        }
        observer.next({
          path: PATH,
          fileName: FILE_NAME,
        });
        observer.complete();
      });
    });
  }

  fileExists(path: string) {
    return existsSync(join(this.staticPath, path));
  }

  removeFile(filePath: string) {
    return new Observable((sub) => {
      unlink(join(this.staticPath, filePath), (e) => {
        if (e) {
          sub.error(e);
          sub.complete();
          return;
        }
        sub.next(true);
        sub.complete();
      });
    });
  }

  getFileStream(fileName: string) {
    const fileStream = createReadStream(join(this.staticPath, fileName));
    return new StreamableFile(fileStream);
  }
}
