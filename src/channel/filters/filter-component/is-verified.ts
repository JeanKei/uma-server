import { Prisma } from "@prisma/client";

export async function buildIsVerifiedWhere(
  isVerified: boolean | undefined
): Promise<Prisma.ChannelWhereInput> {
  if (isVerified === undefined) {
    return {};
  }

  return {
    stats: {
      isVerified,
    },
  };
}
