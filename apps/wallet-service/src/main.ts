import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WalletServiceModule } from './wallet-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WalletServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'wallet',
        protoPath: join(__dirname, '../../../packages/proto/wallet-service.proto'),
        url: `0.0.0.0:${process.env.WALLET_SERVICE_GRPC_PORT || 50052}`,
      },
    },
  );
  await app.listen();
  console.log(`Wallet Service is running on port ${process.env.WALLET_SERVICE_GRPC_PORT || 50052}`);
}
bootstrap();
