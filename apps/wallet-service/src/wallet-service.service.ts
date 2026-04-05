import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import {
  CreateWalletDto,
  GetWalletDto,
  CreditWalletDto,
  DebitWalletDto,
} from './wallet.dto';

interface UserService {
  getUserById(data: { id: string }): any;
}

@Injectable()
export class WalletServiceService {
  private userService: UserService;

  constructor(
    @Inject('USER_SERVICE') private userServiceClient: ClientGrpc,
    private prisma: PrismaService,
  ) {
    this.userService = this.userServiceClient.getService<UserService>(
      'UserService',
    );
  }

  async createWallet(createWalletDto: CreateWalletDto) {
    // Verify user exists by calling User Service
    try {
      await this.userService.getUserById({ id: createWalletDto.userId }).toPromise();
    } catch (error) {
      throw new NotFoundException('User not found');
    }

    // Check if wallet already exists
    const existingWallet = await this.prisma.wallet.findUnique({
      where: { userId: createWalletDto.userId },
    });

    if (existingWallet) {
      throw new BadRequestException('Wallet already exists for this user');
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        userId: createWalletDto.userId,
        balance: 0,
      },
    });

    return wallet;
  }

  async getWallet(getWalletDto: GetWalletDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: getWalletDto.userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }

    return wallet;
  }

  async creditWallet(creditWalletDto: CreditWalletDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: creditWalletDto.userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }

    const updatedWallet = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + creditWalletDto.amount,
      },
    });

    return updatedWallet;
  }

  async debitWallet(debitWalletDto: DebitWalletDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: debitWalletDto.userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }

    if (wallet.balance < debitWalletDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Using Prisma transaction for debit operation
    const updatedWallet = await this.prisma.$transaction(async (tx) => {
      return tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance - debitWalletDto.amount,
        },
      });
    });

    return updatedWallet;
  }
}
