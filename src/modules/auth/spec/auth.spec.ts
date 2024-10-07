import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../auth.module'; // Изменено

describe('AuthController (e2e)', () => { // Изменено название теста
    let app: NestFastifyApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],

        }).compile();

        app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });


    it('/test (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/sign_in')
            .expect(201);
        expect(response.body).toEqual(expect.any(Object));
    });

});