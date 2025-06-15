import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ChannelDto } from "./dto/channel.dto";
import { TelegramService } from "@/telegram/telegram.service";
import { TELEGRAM_MODERATORS } from "@/telegram/telegram.constants";
import { Markup } from "telegraf";
import { buildChannelFilter } from "./filters/channel-filter";
import { ChannelStatus } from "@prisma/client";
import { ChannelQueryInput } from "./filters/channel-filter.types";
import { FileService } from "@/file/file.service";

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
    private readonly fileService: FileService
  ) {}

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    console.log("ChannelService.getCategories result:", categories); // Debug log
    return categories;
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

    console.log("getAll query:", query);
    console.log("getAll where:", JSON.stringify(where, null, 2));

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
          categoriesChannel: {
            include: { category: true },
          },
          stats: true,
        },
      }),
      this.prisma.channel.count({ where }),
    ]);

    console.log("getAll result:", { items: items.length, total });

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

    console.log("getApproved query:", query);
    console.log("getApproved where:", JSON.stringify(where, null, 2));

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
          categoriesChannel: {
            include: { category: true },
          },
          stats: true,
        },
      }),
      this.prisma.channel.count({ where }),
    ]);

    console.log("getApproved result:", { items: items.length, total });

    const hasMore = page * limit < total;
    return { items, total, page, limit, hasMore };
  }

  async getIsActual() {
    const channels = await this.prisma.channel.findMany({
      where: { isActual: true },
      orderBy: { createdAt: "desc" },
      include: {
        categoriesChannel: {
          include: { category: true },
        },
        stats: true,
      },
    });
    console.log("getIsActual result:", channels.length); // Debug log
    return channels;
  }

  async getByUrl(url: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { url },
      include: {
        categoriesChannel: {
          include: { category: true },
        },
        stats: true,
      },
    });

    if (!channel) throw new NotFoundException("Канал не найден");
    console.log("getByUrl result:", channel); // Debug log
    return channel;
  }

  async getUserChannels(userId: string) {
    const channels = await this.prisma.channel.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        categoriesChannel: {
          include: { category: true },
        },
        stats: true,
      },
    });
    console.log("getUserChannels result:", channels.length); // Debug log
    return channels;
  }

  async getById(id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        categoriesChannel: {
          include: { category: true },
        },
        stats: true,
      },
    });

    if (!channel) throw new NotFoundException("Канал не найден");
    console.log("getById result:", channel); // Debug log
    return channel;
  }

  async create(dto: ChannelDto, userId: string, file?: Express.Multer.File) {
    let avatarUrl: string | undefined;

    if (file) {
      const fileResponse = await this.fileService.saveAvatar(file, dto.url);
      avatarUrl = fileResponse.url;
    }

    const { avatarFile, categoryIds, ...channelData } = dto;

    const createdChannel = await this.prisma.channel.create({
      data: {
        ...channelData,
        avatar: avatarUrl,
        userId,
        status: ChannelStatus.MODERATION,
        categoriesChannel: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
        stats: {
          create: {
            isVerified: false,
          },
        },
      },
      include: {
        categoriesChannel: {
          include: { category: true },
        },
        stats: true,
      },
    });

    console.log("create result:", createdChannel); // Debug log

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

  async update(id: string, dto: ChannelDto, file?: Express.Multer.File) {
    await this.getById(id);

    let avatarUrl: string | undefined;

    if (file) {
      const fileResponse = await this.fileService.saveAvatar(file, dto.url);
      avatarUrl = fileResponse.url;
    }

    const { avatarFile, categoryIds, ...channelData } = dto;

    const updatedChannel = await this.prisma.channel.update({
      where: { id },
      data: {
        ...channelData,
        avatar: avatarUrl ?? channelData.avatar,
        categoriesChannel: {
          deleteMany: {}, // Удаляем старые привязки
          create: categoryIds?.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: {
        categoriesChannel: {
          include: { category: true },
        },
        stats: true,
      },
    });

    console.log("update result:", updatedChannel); // Debug log
    return updatedChannel;
  }

  async delete(id: string) {
    const channel = await this.getById(id);

    await this.telegram.notifyChannelDeleted(id);

    const deletedChannel = await this.prisma.channel.delete({
      where: { id },
    });
    console.log("delete result:", deletedChannel); // Debug log
    return deletedChannel;
  }
}
