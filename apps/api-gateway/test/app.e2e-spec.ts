import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, ExecutionContext, INestApplication, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import { ApiGatewayModule } from './../src/api-gateway.module';
import { Transport } from '@nestjs/microservices';
import { APP_GUARD } from '@nestjs/core';

@Injectable()
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('ApiGatewayController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    })
      .overrideProvider(APP_GUARD)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'api_gateway_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    await app.startAllMicroservices();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([
      ...app.getMicroservices().map((ms) => ms.close()),
      app.close(),
    ]);
  });

  it('GET /users - should return all users', async () => {
    const response = await request(app.getHttpServer()).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /products - should create a new product', async () => {
    const productDto = {
      name: 'iPhone 15',
      price: 1499,
      stock: 10,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(productDto)
      .expect(201);
    expect(response.body).toMatchObject(productDto);
    expect(response.body).toHaveProperty('id');
  });

  it('E2E - should create a user and retrieve it', async () => {
    const userDto = {
      name: 'AliceTest',
      email: 'alice123@example.com',
      phone: '9878543210',
      password: 'Alice@123',
    };

    const createRes = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body.email).toBe(userDto.email);

    const createdUserId = createRes.body.id;

    const getRes = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200);

    expect(getRes.body).toMatchObject({
      id: createdUserId,
      email: userDto.email,
      name: userDto.name,
    });
  });
});
