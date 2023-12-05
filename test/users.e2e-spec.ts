import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { Genders } from '../src/core/types/enums/gender.enum';
import { HowWeMet } from '../src/core/types/enums/how-we-met.enum';

describe('AdminController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('create user', () => {
    it('Create user ', async () => {
      const payload: CreateUserDto = {
        firstName: 'امیر',
        lastName: 'خلیلی',
        gender: Genders.Male,
        howWeMet: HowWeMet.ByFriends,
        phoneNumber: '09353756115',
      };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);
      console.log(response.body.id);
      expect(response.statusCode).toBe(201);
    });
  });
});
