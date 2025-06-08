import { Prisma } from "@prisma/client";
import { ChannelFilterInput } from "./channel-filter.types";
import { ChannelService } from "../channel.service";
import { buildSubscribersWhere } from "./filter-component/subscribers";
import { buildViewsWhere } from "./filter-component/views";

export async function buildChannelFilter(
  params: ChannelFilterInput,
  channelService: ChannelService
): Promise<Prisma.ChannelWhereInput> {
  const { minSubscribers, maxSubscribers, minView, maxView } = params;

  const maxValues = await channelService.getMaxValues();
  const subscribersWhere = await buildSubscribersWhere(
    minSubscribers,
    maxSubscribers,
    maxValues.maxSubscribers
  );
  const viewsWhere = await buildViewsWhere(minView, maxView, maxValues.maxView);

  const where: Prisma.ChannelWhereInput = {
    AND: [subscribersWhere, viewsWhere],
  };

  return where;
}
