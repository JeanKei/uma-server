import { Prisma } from "@prisma/client";

export async function buildPricesWhere(
  minPrice: number | undefined,
  maxPrice: number | undefined,
  maxPricesDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const pricesFilter: Prisma.StatsWhereInput["price"] = {};

  if (minPrice !== undefined && minPrice > 0) {
    pricesFilter.gte = minPrice;
  }
  if (maxPrice !== undefined && maxPrice < maxPricesDefault) {
    pricesFilter.lte = maxPrice;
  }

  let where: Prisma.ChannelWhereInput = {
    stats: {
      ...(Object.keys(pricesFilter).length > 0 && {
        price: pricesFilter,
      }),
    },
  };

  if (maxPrice === maxPricesDefault) {
    where = {
      ...where,
      OR: [
        {
          stats: {
            price: { lte: maxPricesDefault },
          },
        },
        {
          stats: {
            price: null,
          },
        },
      ],
    };
  }

  return where;
}
