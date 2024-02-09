import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginAdminDto } from '../src/admins/dto/login-admin.dto';
import { CreatePlanDto } from 'src/plans/dto/create-plan.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const login = new LoginAdminDto();
    login.password = 'amirkhalili047';
    login.usernameOrEmail = 'khaliliamir565@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/admin/login')
      .send(login);
    accessToken = response.body.accessToken as string;
  });

  describe('Plans', async () => {
    const data: CreatePlanDto = {
      planDescription: 'Test',
      planLogo: 'EMPTY',
      planName: 'Golden plan',
      priceIRT: 500_000,
    };
    const response = await request(app.getHttpServer())
      .post('/plans')
      .send(data);

    expect(response.body.planID).not.toBeFalsy();
    expect(response.statusCode).toBe(201);
  });
});
