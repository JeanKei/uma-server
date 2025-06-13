import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ChannelDto } from "./dto/channel.dto";
import { TelegramService } from "@/telegram/telegram.service";
import { TELEGRAM_MODERATORS } from "@/telegram/telegram.constants";
import { Markup } from "telegraf";
import { buildChannelFilter } from "./filters/channel-filter";
import { ChannelStatus } from "@prisma/client";
import { ChannelQueryInput } from "./filters/channel-filter.types";

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService
  ) {}

  async getCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async getMaxValues() {
    const statInitialMax = await this.prisma.stats.aggregate({
      _max: {
        subscribers: true,
        view: true,
        er: true,
        cpv: true,
      },
    });

    const statChannelMax = await this.prisma.channel.aggregate({
      _max: {
        price: true,
      },
    });

    return {
      maxSubscribers: statInitialMax._max.subscribers || 0,
      maxView: statInitialMax._max.view || 0,
      maxPrice: statChannelMax._max.price || 0,
      maxEr: statInitialMax._max.er || 0,
      maxCpv: statInitialMax._max.cpv || 0,
    };
  }

  async getAll(query: ChannelQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const filter = query.filter || {};
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const where = await buildChannelFilter(filter, this);

    console.log("Received query:", query);
    console.log("Prisma query where:", JSON.stringify(where, null, 2));

    const orderBy =
      sortBy === "createdAt"
        ? { createdAt: sortOrder }
        : { stats: { [sortBy]: sortOrder } };

    const [items, total] = await Promise.all([
      this.prisma.channel.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          statPublic: true,
          categoriesChannel: {
            include: { category: true },
          },
          stats: true,
        },
      }),
      this.prisma.channel.count({ where }),
    ]);

    console.log("Query result:", { items: items.length, total });

    const hasMore = page * limit < total;
    return { items, total, page, limit, hasMore };
  }

  async getApproved(query: ChannelQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const filter = query.filter || {};
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const filterWhere = await buildChannelFilter(filter, this);

    const where = {
      ...filterWhere,
      status: ChannelStatus.APPROVED,
    };

    console.log("Received query:", query);
    console.log("Prisma query where:", JSON.stringify(where, null, 2));

    const orderBy =
      sortBy === "createdAt"
        ? { createdAt: sortOrder }
        : { stats: { [sortBy]: sortOrder } };

    const [items, total] = await Promise.all([
      this.prisma.channel.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          statPublic: true,
          categoriesChannel: {
            include: { category: true },
          },
          stats: true,
        },
      }),
      this.prisma.channel.count({ where }),
    ]);

    console.log("Query result:", { items: items.length, total });

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
        stats: true,
      },
    });
  }

  async getByUrl(url: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { url },
      include: {
        statPublic: true,
        categoriesChannel: true,
        stats: true,
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
        stats: true,
      },
    });
  }

  async getById(id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        statPublic: true,
        categoriesChannel: true,
        stats: true,
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
        stats: {
          create: {},
        },
      },
      include: {
        statPublic: true,
        categoriesChannel: true,
        stats: true,
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
        stats: true,
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
