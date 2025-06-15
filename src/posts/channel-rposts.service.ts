import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChannelPostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByChannelId(channelId: string) {
    return this.prisma.post.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      include: {
        channel: true,
      },
    });
  }
}
