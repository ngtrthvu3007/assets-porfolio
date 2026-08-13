import { Prisma } from "@prisma/client";

export const toJsonInput = (value: unknown): Prisma.InputJsonValue => {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
};
