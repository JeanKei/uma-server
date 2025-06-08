import { Prisma } from "@prisma/client";
import { ChannelFilterInput } from "./channel-filter.types";
import { ChannelService } from "../channel.service";
import { buildSubscribersWhere } from "./filter-component/subscribers";
import { buildViewsWhere } from "./filter-component/views";
import { buildErWhere } from "./filter-component/er";
import { buildCpvWhere } from "./filter-component/cpv";

export async function buildChannelFilter(
  params: ChannelFilterInput,
  channelService: ChannelService
): Promise<Prisma.ChannelWhereInput> {
  const {
    minSubscribers,
    maxSubscribers,
    minView,
    maxView,
    minEr,
    maxEr,
    minCpv,
    maxCpv,
  } = params;

  const maxValues = await channelService.getMaxValues();
  const subscribersWhere = await buildSubscribersWhere(
    minSubscribers,
    maxSubscribers,
    maxValues.maxSubscribers
  );

  const erWhere = await buildErWhere(minEr, maxEr, maxValues.maxEr);

  const viewsWhere = await buildViewsWhere(minView, maxView, maxValues.maxView);

  const cpvWhere = await buildCpvWhere(minCpv, maxCpv, maxValues.maxCpv);

  const where: Prisma.ChannelWhereInput = {
    AND: [subscribersWhere, viewsWhere, erWhere, cpvWhere],
  };

  return where;
}
