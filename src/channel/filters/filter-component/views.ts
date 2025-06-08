import { Prisma } from "@prisma/client";

export async function buildViewsWhere(
  minView: number | undefined,
  maxView: number | undefined,
  maxViewsDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const viewsFilter: Prisma.StatInitialWhereInput["view"] = {};

  if (minView !== undefined && minView > 0) {
    viewsFilter.gte = minView;
  }
  if (maxView !== undefined && maxView < maxViewsDefault) {
    viewsFilter.lte = maxView;
  }

  let where: Prisma.ChannelWhereInput = {
    statInitial: {
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
          statInitial: {
            view: { lte: maxViewsDefault },
          },
        },
        {
          statInitial: {
            view: null,
          },
        },
      ],
    };
  }

  return where;
}
