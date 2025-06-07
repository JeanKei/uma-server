import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ChannelDto } from "./dto/channel.dto";
import { TelegramService } from "@/telegram/telegram.service";
import { TELEGRAM_MODERATORS } from "@/telegram/telegram.constants";
import { Markup } from "telegraf";
import {
  buildChannelFilter,
  ChannelFilterInput,
} from "./filters/channel.filter";
import { ChannelStatus } from "@prisma/client";

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService
  ) {}

  // async getAll(page = 1, limit = 10) {
  //   const skip = (page - 1) * limit;

  //   const [items, total] = await Promise.all([
  //     this.prisma.channel.findMany({
  //       skip,
  //       take: limit,
  //       orderBy: { createdAt: "desc" },
  //       include: {
  //         statPublic: true,
  //         categoriesChannel: true,
  //         statInitial: true,
  //       },
  //     }),
  //     this.prisma.channel.count(),
  //   ]);

  //   const hasMore = page * limit < total;

  //   return { items, total, page, limit, hasMore };
  // }

  // async getApproved(page = 1, limit = 10) {
  //   const skip = (page - 1) * limit;

  //   const [items, total] = await Promise.all([
  //     this.prisma.channel.findMany({
  //       where: { status: "APPROVED" },
  //       skip,
  //       take: limit,
  //       orderBy: { createdAt: "desc" },
  //       include: {
  //         statPublic: true,
  //         categoriesChannel: true,
  //         statInitial: true,
  //       },
  //     }),
  //     this.prisma.channel.count({
  //       where: { status: "APPROVED" },
  //     }),
  //   ]);

  //   const hasMore = page * limit < total;

  //   return { items, total, page, limit, hasMore };
  // }

  async getAll(page = 1, limit = 10, filter: ChannelFilterInput = {}) {
    const skip = (page - 1) * limit;
    const where = buildChannelFilter(filter);

    const [items, total] = await Promise.all([
      this.prisma.channel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          statPublic: true,
          categoriesChannel: true,
          statInitial: true,
        },
      }),
      this.prisma.channel.count({ where }),
    ]);

    const hasMore = page * limit < total;
    return { items, total, page, limit, hasMore };
  }

  async getApproved(page = 1, limit = 10, filter: ChannelFilterInput = {}) {
    const skip = (page - 1) * limit;

    const filterWhere = buildChannelFilter(filter);

    const where = {
      ...filterWhere,
      status: ChannelStatus.APPROVED,
    };

    const [items, total] = await Promise.all([
      this.prisma.channel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          statPublic: true,
          categoriesChannel: true,
          statInitial: true,
        },
      }),
      this.prisma.channel.count({ where }),
    ]);

    const hasMore = page * limit < total;
    return { items, total, page, limit, hasMore };
  }

  async getIsActual() {
    return this.prisma.channel.findMany({
      where: { isActual: true },
      orderBy: { createdAt: "desc" },
      include: {
        statPublic: true,
        categoriesChannel: true,
        statInitial: true,
      },
    });
  }

  async getByUrl(url: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { url },
      include: {
        statPublic: true,
        categoriesChannel: true,
        statInitial: true,
      },
    });

    if (!channel) throw new NotFoundException("Канал не найден");
    return channel;
  }

  async getUserChannels(userId: string) {
    return this.prisma.channel.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        statPublic: true,
        categoriesChannel: true,
        statInitial: true,
      },
    });
  }

  async getById(id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        statPublic: true,
        categoriesChannel: true,
        statInitial: true,
      },
    });

    if (!channel) throw new NotFoundException("Канал не найден");
    return channel;
  }

  async create(dto: ChannelDto, userId: string) {
    const createdChannel = await this.prisma.channel.create({
      data: {
        ...dto,
        userId,
        status: "MODERATION",
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, telegramId: true },
    });

    if (user?.telegramId) {
      await this.telegram.sendMessage(
        Number(user.telegramId),
        `✅ Ваш канал <b>${createdChannel.url}</b> успешно добавлен. Ожидайте модерации.`,
        { parse_mode: "HTML" }
      );
    }

    const inlineKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "💬 Связаться с клиентом",
          `start_chat:${createdChannel.id}:${user?.telegramId}`
        ),
      ],
      [
        Markup.button.callback(
          "✅ Одобрить",
          `approve:${createdChannel.id}:${user?.telegramId}`
        ),
        Markup.button.callback(
          "❌ Отклонить",
          `reject:${createdChannel.id}:${user?.telegramId}`
        ),
      ],
    ]);

    for (const modId of TELEGRAM_MODERATORS) {
      await this.telegram.sendMessage(
        modId,
        `📥 Новый канал от @${user?.name ?? "пользователь"}:\n📎 ${createdChannel.url}`,
        {
          parse_mode: "HTML",
          ...inlineKeyboard,
        }
      );
    }

    return createdChannel;
  }

  async update(id: string, dto: ChannelDto) {
    await this.getById(id);

    return this.prisma.channel.update({
      where: { id },
      data: {
        ...dto,
      },
      include: {
        statPublic: true,
        categoriesChannel: true,
        statInitial: true,
      },
    });
  }

  async delete(id: string) {
    const channel = await this.getById(id);

    await this.telegram.notifyChannelDeleted(id);

    return this.prisma.channel.delete({
      where: { id },
    });
  }
}
