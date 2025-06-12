import { Prisma } from "@prisma/client";

export async function buildViewsWhere(
  minView: number | undefined,
  maxView: number | undefined,
  maxViewsDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const viewsFilter: Prisma.StatsWhereInput["view"] = {};

  if (minView !== undefined && minView > 0) {
    viewsFilter.gte = minView;
  }
  if (maxView !== undefined && maxView < maxViewsDefault) {
    viewsFilter.lte = maxView;
  }

  let where: Prisma.ChannelWhereInput = {
    stats: {
      ...(Object.keys(viewsFilter).length > 0 && {
        view: viewsFilter,
      }),
    },
  };

  if (maxView === maxViewsDefault) {
    where = {
      ...where,
      OR: [
        {
          stats: {
            view: { lte: maxViewsDefault },
          },
        },
        {
          stats: {
            view: null,
          },
        },
      ],
    };
  }

  return where;
}
