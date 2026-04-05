import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WalletServiceController } from './wallet-service.controller';
import { WalletServiceService } from './wallet-service.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../../packages/proto/user-service.proto'),
          url: `localhost:${process.env.USER_SERVICE_GRPC_PORT || 50051}`,
        },
      },
    ]),
  ],
  controllers: [WalletServiceController],
  providers: [WalletServiceService, PrismaService],
})
export class WalletServiceModule {}
