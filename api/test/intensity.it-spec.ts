import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig, MikroORM } from '@mikro-orm/postgresql';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { IntensityModule } from '../src/intensity/intensity.module';
import { CarbonIntensityResponseDTO } from 'src/intensity/dto/carbon-intensity-response.dto';

describe('IntensitiesController IT', () => {
  const baseUrl = '/intensities';

  jest.setTimeout(60000);

  let container: StartedPostgreSqlContainer;
  let app: INestApplication<App>;
  let orm: MikroORM;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withUsername('test')
      .withDatabase('test')
      .withPassword('test')
      .start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(
          defineConfig({
            dbName: container.getDatabase(),
            user: container.getUsername(),
            password: container.getPassword(),
            port: container.getFirstMappedPort(),
            debug: true,
            entities: ['src/database/entities'],
            logger: () => {},
          }),
        ),
        IntensityModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    orm = moduleFixture.get<MikroORM>(MikroORM);

    // create schema
    await orm.schema.createSchema();

    // start the app
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await orm.schema.refreshDatabase();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
    await container.stop();
  });

  describe('GET /intensities', () => {
    it('responds with empty body array', async () => {
      const response = await request(app.getHttpServer()).get(baseUrl);

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual([]);
    });

    it('responds with array with 1 item', async () => {
      const newItemResponse = await request(app.getHttpServer())
        .post(baseUrl)
        .send({
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'low',
          forecast: 200,
          actual: 300,
        });

      const response = await request(app.getHttpServer()).get(baseUrl);

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual([newItemResponse.body]);
    });
  });

  describe('POST /intensities', () => {
    it('creates a new intensity', async () => {
      const dto = {
        from: '2020-01-22T17:00:00.000Z',
        to: '2020-01-22T17:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };

      const expected = { ...dto, id: 1 };

      const response = await request(app.getHttpServer())
        .post(baseUrl)
        .send(dto);

      expect(response.status).toEqual(201);
      expect(response.body).toStrictEqual(expected);
    });

    it('throws error when from and to date are not unique', async () => {
      const dto = {
        from: '2020-01-22T17:00:00.000Z',
        to: '2020-01-22T17:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };

      await request(app.getHttpServer()).post(baseUrl).send(dto);

      const response = await request(app.getHttpServer())
        .post(baseUrl)
        .send(dto);

      expect(response.status).toEqual(400);
      expect(response.body).toStrictEqual({
        error: 'Bad Request',
        message: 'to and from should be unique',
        statusCode: 400,
      });
    });

    describe('validation', () => {
      it('fails when index is not a valid value', async () => {
        const dto = {
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'test',
          forecast: 200,
          actual: 300,
        };

        const response = await request(app.getHttpServer())
          .post(baseUrl)
          .send(dto);

        expect(response.status).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'index must be one of the following values: low, moderate, high, very high',
          ],
          statusCode: 400,
        });
      });

      it.each([
        ['from', { from: 'not valid date string' }],
        ['to', { to: 'random invalid date string' }],
      ])('fails when %s is not a valid date string', async (text, obj) => {
        const dto = {
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'low',
          forecast: 200,
          actual: 300,
          ...obj,
        };

        const response = await request(app.getHttpServer())
          .post(baseUrl)
          .send(dto);

        expect(response.status).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: [`${text} must be a valid ISO 8601 date string`],
          statusCode: 400,
        });
      });

      it.each([
        ['forecast', { forecast: -1 }],
        ['actual', { actual: -1 }],
      ])('fails when %s is a negative number', async (text, obj) => {
        const dto = {
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'low',
          forecast: 200,
          actual: 300,
          ...obj,
        };

        const response = await request(app.getHttpServer())
          .post(baseUrl)
          .send(dto);

        expect(response.status).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: [`${text} must be a positive number`],
          statusCode: 400,
        });
      });
    });
  });

  describe('PUT /intensities', () => {
    const testId = 1;

    it('updates intensity', async () => {
      const dto = {
        from: '2020-01-22T18:00:00.000Z',
        to: '2020-01-22T18:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };

      const expected = {
        ...dto,
        forecast: 100,
        actual: 200,
        id: testId,
      };

      await request(app.getHttpServer()).post(baseUrl).send(dto);

      const updatedResponse = await request(app.getHttpServer())
        .put(`${baseUrl}/${testId}`)
        .send({
          ...dto,
          forecast: 100,
          actual: 200,
        });

      expect(updatedResponse.status).toEqual(200);
      expect(updatedResponse.body).toStrictEqual(expected);
    });

    it('throws error when intensity is not found', async () => {
      const dto = {
        from: '2020-01-22T18:00:00.000Z',
        to: '2020-01-22T18:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };
      const updatedResponse = await request(app.getHttpServer())
        .put(`${baseUrl}/${testId}`)
        .send(dto);

      expect(updatedResponse.status).toEqual(404);
      expect(updatedResponse.body).toStrictEqual({
        error: 'Not Found',
        message: 'carbon intensity does not exist',
        statusCode: 404,
      });
    });

    it('throws error when from and to date are not unique', async () => {
      const dto = {
        from: '2020-01-22T17:00:00.000Z',
        to: '2020-01-22T17:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };

      const dto2 = {
        from: '2020-01-22T18:00:00.000Z',
        to: '2020-01-22T18:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };

      await request(app.getHttpServer()).post(baseUrl).send(dto);

      const response = (await request(app.getHttpServer())
        .post(baseUrl)
        .send(dto2)) as Omit<request.Response, 'body'> & {
        body: CarbonIntensityResponseDTO;
      };

      const updatedResponse = await request(app.getHttpServer())
        .put(`${baseUrl}/${response.body.id}`)
        .send({
          ...dto2,
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
        });

      expect(updatedResponse.status).toEqual(400);
      expect(updatedResponse.body).toStrictEqual({
        error: 'Bad Request',
        message: 'to and from should be unique',
        statusCode: 400,
      });
    });

    describe('validation', () => {
      it('fails when index is not a valid value', async () => {
        const dto = {
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'test',
          forecast: 200,
          actual: 300,
        };

        const response = await request(app.getHttpServer())
          .put(`${baseUrl}/${testId}`)
          .send(dto);

        expect(response.status).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: [
            'index must be one of the following values: low, moderate, high, very high',
          ],
          statusCode: 400,
        });
      });

      it.each([
        ['from', { from: 'not valid date string' }],
        ['to', { to: 'random invalid date string' }],
      ])('fails when %s is not a valid date string', async (text, obj) => {
        const dto = {
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'low',
          forecast: 200,
          actual: 300,
          ...obj,
        };

        const response = await request(app.getHttpServer())
          .put(`${baseUrl}/${testId}`)
          .send(dto);

        expect(response.status).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: [`${text} must be a valid ISO 8601 date string`],
          statusCode: 400,
        });
      });

      it.each([
        ['forecast', { forecast: -1 }],
        ['actual', { actual: -1 }],
      ])('fails when %s is a negative number', async (text, obj) => {
        const dto = {
          from: '2020-01-22T17:00:00.000Z',
          to: '2020-01-22T17:30:00.000Z',
          index: 'low',
          forecast: 200,
          actual: 300,
          ...obj,
        };

        const response = await request(app.getHttpServer())
          .put(`${baseUrl}/${testId}`)
          .send(dto);

        expect(response.status).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: [`${text} must be a positive number`],
          statusCode: 400,
        });
      });
    });
  });

  describe('DELETE /intensities', () => {
    const testId = 1;

    it('deletes intensity', async () => {
      const dto = {
        from: '2020-01-22T17:00:00.000Z',
        to: '2020-01-22T17:30:00.000Z',
        index: 'low',
        forecast: 200,
        actual: 300,
      };

      await request(app.getHttpServer()).post(baseUrl).send(dto);

      const response = await request(app.getHttpServer()).delete(
        `${baseUrl}/${testId}`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({ id: testId });
    });

    it('throws error when intensity is not found', async () => {
      const response = await request(app.getHttpServer()).delete(
        `${baseUrl}/${testId}`,
      );

      expect(response.status).toEqual(404);
      expect(response.body).toStrictEqual({
        message: 'Not Found',
        statusCode: 404,
      });
    });
  });
});
