import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Gateway for all services')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-access-token',
        in: 'header',
      },
      'x-access-token', // Security name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APIGETWAYPORT || 3000);
}
bootstrap();
