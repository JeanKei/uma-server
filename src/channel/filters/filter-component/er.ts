import { Prisma } from "@prisma/client";

export async function buildErWhere(
  minEr: number | undefined,
  maxEr: number | undefined,
  maxErDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const erFilter: Prisma.StatInitialWhereInput["er"] = {};

  if (minEr !== undefined && minEr > 0) {
    erFilter.gte = minEr;
  }
  if (maxEr !== undefined && maxEr < maxErDefault) {
    erFilter.lte = maxEr;
  }

  let where: Prisma.ChannelWhereInput = {
    statInitial: {
      ...(Object.keys(erFilter).length > 0 && {
        er: erFilter,
      }),
    },
  };

  if (maxEr === maxErDefault) {
    where = {
      ...where,
      OR: [
        {
          statInitial: {
            er: { lte: maxErDefault },
          },
        },
        {
          statInitial: {
            er: null,
          },
        },
      ],
    };
  }

  return where;
}
