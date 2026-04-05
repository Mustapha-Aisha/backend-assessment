import { IsString, IsNumber, Min } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  userId: string;
}

export class GetWalletDto {
  @IsString()
  userId: string;
}

export class CreditWalletDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

export class DebitWalletDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
