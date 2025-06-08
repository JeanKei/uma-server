import { Prisma } from "@prisma/client";

export async function buildSubscribersWhere(
  minSubscribers: number | undefined,
  maxSubscribers: number | undefined,
  maxSubscribersDefault: number
): Promise<Prisma.ChannelWhereInput> {
  const subscribersFilter: Prisma.StatInitialWhereInput["subscribers"] = {};

  if (minSubscribers !== undefined && minSubscribers > 0) {
    subscribersFilter.gte = minSubscribers;
  }
  if (maxSubscribers !== undefined && maxSubscribers < maxSubscribersDefault) {
    subscribersFilter.lte = maxSubscribers;
  }

  let where: Prisma.ChannelWhereInput = {
    statInitial: {
      ...(Object.keys(subscribersFilter).length > 0 && {
        subscribers: subscribersFilter,
      }),
    },
  };

  if (maxSubscribers === maxSubscribersDefault) {
    where = {
      ...where,
      OR: [
        {
          statInitial: {
            subscribers: { lte: maxSubscribersDefault },
          },
        },
        {
          statInitial: {
            subscribers: null,
          },
        },
      ],
    };
  }

  return where;
}
