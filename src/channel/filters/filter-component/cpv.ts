import { Prisma } from "@prisma/client";

export async function buildCpvWhere(
  minCpv: number | undefined,
  maxCpv: number | undefined,
  maxCpvDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const cpvFilter: Prisma.StatInitialWhereInput["cpv"] = {};

  if (minCpv !== undefined && minCpv > 0) {
    cpvFilter.gte = minCpv;
  }
  if (maxCpv !== undefined && maxCpv < maxCpvDefault) {
    cpvFilter.lte = maxCpv;
  }

  let where: Prisma.ChannelWhereInput = {
    statInitial: {
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
          statInitial: {
            cpv: { lte: maxCpvDefault },
          },
        },
        {
          statInitial: {
            cpv: null,
          },
        },
      ],
    };
  }

  return where;
}
