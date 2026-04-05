import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [UserServiceController],
  providers: [UserServiceService, PrismaService],
})
export class UserServiceModule {}
