import type { Prisma } from '@prisma/client';

export const toNullableNumber = (
  value: Prisma.Decimal | null | undefined,
): number | null => {
  return value ? value.toNumber() : null;
};
