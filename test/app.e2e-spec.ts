import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// Note: This code requires a database connection.
// Please modify the MONGODB_URI in the .env file before running the tests.
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/me (GET)', async () => {
    return request(app.getHttpServer()).get('/me').expect(401).expect({ statusCode: 401, message: 'Unauthorized' });
  });
});
