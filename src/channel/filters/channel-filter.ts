import { Prisma } from "@prisma/client";
import { ChannelFilterInput } from "./channel-filter.types";
import { ChannelService } from "../channel.service";
import { buildSubscribersWhere } from "./filter-component/subscribers";

export async function buildChannelFilter(
  params: ChannelFilterInput,
  channelService: ChannelService
): Promise<Prisma.ChannelWhereInput> {
  const { minSubscribers, maxSubscribers } = params;

  const maxValues = await channelService.getMaxValues();
  const where = await buildSubscribersWhere(
    minSubscribers,
    maxSubscribers,
    maxValues.maxSubscribers
  );

  return where;
}
