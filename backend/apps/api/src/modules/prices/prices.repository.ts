import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database';

@Injectable()
export class PricesRepository {
  public constructor(private readonly prismaService: PrismaService) {}
}
