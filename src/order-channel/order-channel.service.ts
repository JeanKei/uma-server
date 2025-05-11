import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class OrderChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrder() {
    return this.prisma.telegramChannel.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
  }
}
