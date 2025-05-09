import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UserChannelDto } from "./dto/user-channel.dto";

@Injectable()
export class UserChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const channel = await this.prismaService.telegramChannel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return channel;
  }

  async getById(id: string) {
    const channel = await this.prismaService.telegramChannel.findUnique({
      where: {
        id,
      },
    });
    if (!channel) throw new NotFoundException("Категория не найдена");

    return channel;
  }

  async create(dto: UserChannelDto, userId: string) {
    return this.prismaService.telegramChannel.create({
      data: {
        url: dto.url,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async update(id: string, dto: UserChannelDto) {
    await this.getById(id);

    return this.prismaService.telegramChannel.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return this.prismaService.telegramChannel.delete({
      where: { id },
    });
  }
}
