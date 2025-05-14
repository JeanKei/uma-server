import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ChannelDto } from "./dto/channel.dto";
import { TelegramService } from "@/telegram/telegram.service";
import { TELEGRAM_MODERATORS } from "@/telegram/telegram.constants";
import { Markup } from "telegraf";

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService
  ) {}

  async getAll() {
    return this.prisma.telegramChannel.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getApproved() {
    return this.prisma.telegramChannel.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
  }

  async getIsActual() {
    return this.prisma.telegramChannel.findMany({
      where: { isActual: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserChannels(userId: string) {
    return this.prisma.telegramChannel.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    const channel = await this.prisma.telegramChannel.findUnique({
      where: { id },
    });

    if (!channel) throw new NotFoundException("Канал не найден");
    return channel;
  }

  async create(dto: ChannelDto, userId: string) {
    const createdChannel = await this.prisma.telegramChannel.create({
      data: {
        url: dto.url,
        userId,
        status: "MODERATION",
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, telegramId: true },
    });

    // ✅ Уведомляем клиента
    if (user?.telegramId) {
      await this.telegram.sendMessage(
        Number(user.telegramId),
        `✅ Ваш канал <b>${createdChannel.url}</b> успешно добавлен. Ожидайте модерации.`,
        { parse_mode: "HTML" }
      );
    }

    // ✅ Кнопки модерации
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

    // ✅ Уведомляем модераторов
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

    return this.prisma.telegramChannel.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const channel = await this.getById(id);

    // ✅ Отправляем уведомления в Telegram
    await this.telegram.notifyChannelDeleted(id);

    return this.prisma.telegramChannel.delete({
      where: { id },
    });
  }
}
