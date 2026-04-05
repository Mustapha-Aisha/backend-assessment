import { Controller, BadRequestException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { WalletServiceService } from './wallet-service.service';
import {
  CreateWalletDto,
  GetWalletDto,
  CreditWalletDto,
  DebitWalletDto,
} from './wallet.dto';

@Controller()
export class WalletServiceController {
  constructor(private readonly walletServiceService: WalletServiceService) {}

  @GrpcMethod('WalletService', 'CreateWallet')
  async createWallet(data: { userId: string }) {
    const dto = plainToInstance(CreateWalletDto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints ?? {})).flat(),
      );
    }

    const wallet = await this.walletServiceService.createWallet(dto);
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      createdAt: wallet.createdAt.toISOString(),
    };
  }

  @GrpcMethod('WalletService', 'GetWallet')
  async getWallet(data: { userId: string }) {
    const dto = plainToInstance(GetWalletDto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints ?? {})).flat(),
      );
    }

    const wallet = await this.walletServiceService.getWallet(dto);
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      createdAt: wallet.createdAt.toISOString(),
    };
  }

  @GrpcMethod('WalletService', 'CreditWallet')
  async creditWallet(data: { userId: string; amount: number }) {
    const dto = plainToInstance(CreditWalletDto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints ?? {})).flat(),
      );
    }

    const wallet = await this.walletServiceService.creditWallet(dto);
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
    };
  }

  @GrpcMethod('WalletService', 'DebitWallet')
  async debitWallet(data: { userId: string; amount: number }) {
    const dto = plainToInstance(DebitWalletDto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints ?? {})).flat(),
      );
    }

    const wallet = await this.walletServiceService.debitWallet(dto);
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
    };
  }
}
