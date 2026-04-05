import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, '../../../packages/proto/user-service.proto'),
        url: `0.0.0.0:${process.env.USER_SERVICE_GRPC_PORT || 50051}`,
      },
    },
  );
  await app.listen();
  console.log(`User Service is running on port ${process.env.USER_SERVICE_GRPC_PORT || 50051}`);
}
bootstrap();
