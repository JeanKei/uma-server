import { Prisma } from "@prisma/client";

export async function buildGenderWhere(
  gender: number | undefined
): Promise<Prisma.ChannelWhereInput> {
  if (gender === undefined) {
    return {};
  }

  const genderFilter: Prisma.StatsWhereInput["gender"] = {
    gte: Math.max(0, gender - 5), // Допуск -5%
    lte: Math.min(100, gender + 5), // Допуск +5%
  };

  return {
    stats: {
      gender: genderFilter,
    },
  };
}
