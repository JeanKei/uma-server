import { Prisma } from "@prisma/client";
import { ChannelFilterInput } from "./channel-filter.types";
import { ChannelService } from "../channel.service";
import { buildSubscribersWhere } from "./filter-component/subscribers";
import { buildViewsWhere } from "./filter-component/views";
import { buildPricesWhere } from "./filter-component/price";
import { buildErWhere } from "./filter-component/er";
import { buildCpvWhere } from "./filter-component/cpv";
import { buildIsVerifiedWhere } from "./filter-component/is-verified";

export async function buildChannelFilter(
  params: ChannelFilterInput,
  channelService: ChannelService
): Promise<Prisma.ChannelWhereInput> {
  const {
    minSubscribers,
    maxSubscribers,
    minView,
    maxView,
    minPrice,
    maxPrice,
    minEr,
    maxEr,
    minCpv,
    maxCpv,
    searchQuery,
    categories,
    isVerified,
  } = params;

  const maxValues = await channelService.getMaxValues();
  const subscribersWhere = await buildSubscribersWhere(
    minSubscribers,
    maxSubscribers,
    maxValues.maxSubscribers
  );

  const erWhere = await buildErWhere(minEr, maxEr, maxValues.maxEr);

  const viewsWhere = await buildViewsWhere(minView, maxView, maxValues.maxView);

  const priceWhere = await buildPricesWhere(
    minPrice,
    maxPrice,
    maxValues.maxPrice
  );

  const cpvWhere = await buildCpvWhere(minCpv, maxCpv, maxValues.maxCpv);

  const searchWhere: Prisma.ChannelWhereInput = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          { url: { contains: searchQuery, mode: "insensitive" } },
        ],
      }
    : {};

  const categoriesWhere: Prisma.ChannelWhereInput = categories?.length
    ? {
        categoriesChannel: {
          some: {
            categoryId: { in: categories },
          },
        },
      }
    : {};

  const isVerifiedWhere = await buildIsVerifiedWhere(isVerified);

  const where: Prisma.ChannelWhereInput = {
    AND: [
      subscribersWhere,
      viewsWhere,
      priceWhere,
      erWhere,
      cpvWhere,
      searchWhere,
      categoriesWhere,
      isVerifiedWhere,
    ],
  };

  return where;
}
