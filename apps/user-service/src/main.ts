import { NestFactory } from '@nestjs/core';
import { UserModule } from './user-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(UserModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices(); 
  await app.listen(process.env.USERPORT || 3001);
}

bootstrap();
