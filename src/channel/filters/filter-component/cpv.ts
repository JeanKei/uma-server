import { Prisma } from "@prisma/client";

export async function buildCpvWhere(
  minCpv: number | undefined,
  maxCpv: number | undefined,
  maxCpvDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const cpvFilter: Prisma.StatsWhereInput["cpv"] = {};

  if (minCpv !== undefined && minCpv > 0) {
    cpvFilter.gte = minCpv;
  }
  if (maxCpv !== undefined && maxCpv < maxCpvDefault) {
    cpvFilter.lte = maxCpv;
  }

  let where: Prisma.ChannelWhereInput = {
    stats: {
      ...(Object.keys(cpvFilter).length > 0 && {
        cpv: cpvFilter,
      }),
    },
  };

  if (maxCpv === maxCpvDefault) {
    where = {
      ...where,
      OR: [
        {
          stats: {
            cpv: { lte: maxCpvDefault },
          },
        },
        {
          stats: {
            cpv: null,
          },
        },
      ],
    };
  }

  return where;
}
