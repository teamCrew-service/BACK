import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // home 부분 테스트
  // it('/home/map (GET)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/home/map')
  //     .expect(200)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();
  // });
});
